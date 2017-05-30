#!/usr/bin/env python
"""
Watson push:

A watson-free implementation of Watson's push command used to load your frames
to a crick api server instance.
"""
import argparse
import http.client
import json
import logging
import os
import uuid

from os.path import expanduser
from datetime import datetime, timezone

DEFAULT_API_SERVER_DOMAIN = '127.0.0.1'
DEFAULT_API_SERVER_PORT = 8000
DEFAULT_FRAMES_PATH = expanduser('~/Library/Application Support/watson/frames')


def parse_cmd_line():
    """Parse used command line and return arguments"""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '-f', '--frames', dest='frames_path', default=DEFAULT_FRAMES_PATH,
        help="Watson frames file path"
    )
    parser.add_argument(
        '-s', '--server-domain', dest='server_domain',
        default=DEFAULT_API_SERVER_DOMAIN,
        help="Crick server domain (e.g. localhost)"
    )
    parser.add_argument(
        '-p', '--port', dest='server_port', default=DEFAULT_API_SERVER_PORT,
        help="Crick server port (e.g. 8000)"
    )
    parser.add_argument(
        '-v', '--verbose', dest='logging_level', action='store_const',
        const=logging.INFO, default=logging.WARNING,
        help="Verbose mode"
    )
    parser.add_argument(
        '-d', '--debug', dest='logging_level', action='store_const',
        const=logging.DEBUG,
        help="Debug mode"
    )
    return parser.parse_args()


def check_environ():
    """Check user environment"""
    if 'CRICK_API_TOKEN' not in os.environ:
        raise EnvironmentError(
            'CRICK_API_TOKEN environment variable is not defined'
        )


def configure_logging(level=logging.WARNING):
    """Configure logging level"""
    logging.basicConfig(level=level)


def _to_frame(start, stop, project, id, tags, *args):
    """Convert internal frame representation to expected json schema"""

    return {
        'start_at': datetime.fromtimestamp(start, timezone.utc).isoformat(),
        'end_at': datetime.fromtimestamp(stop, timezone.utc).isoformat(),
        'project': project,
        'id': str(uuid.UUID(id)),
        'tags': tags,
    }


def load_frames(frames_path, last=100):
    """Load Watson's frames"""
    logging.debug('Will load frames file: "{}"'.format(frames_path))

    with open(frames_path) as frames_file:
        frames = list(json.load(frames_file))
        return [_to_frame(*f) for f in frames[-last:]]


def push(frames_path, server_domain, server_port, token,
         endpoint='/watson/frames/bulk'):
    """Push frames to the API server"""
    logging.info(
        (
            'Will push frames parsed from file "{}" to "http://{}:{}{}" using '
            'token starting with: {}...'
        ).format(
            frames_path, server_domain, server_port, endpoint, token[:10]
        )
    )

    # Load user frames
    frames = load_frames(frames_path)
    payload = json.dumps(frames)
    logging.debug('Payload: {}'.format(payload))

    # Perform the API request
    connection = http.client.HTTPConnection(server_domain, server_port)
    headers = {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': 'Token {}'.format(token),
    }
    connection.request(
        'POST',
        endpoint,
        payload,
        headers,
    )
    response = connection.getresponse()
    data = response.read().decode()
    connection.close()

    if response.status >= 200 and response.status < 300:
        logging.info('Importation done.')
    else:
        logging.error(
            'Importation failed.\nAPI response: {} ({}):\n{}'.format(
                response.status,
                response.reason,
                data
            )
        )


def main():
    args = parse_cmd_line()
    configure_logging(level=args.logging_level)
    check_environ()
    push(
        args.frames_path,
        args.server_domain,
        args.server_port,
        os.environ.get('CRICK_API_TOKEN')
    )


if __name__ == '__main__':
    main()

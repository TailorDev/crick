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

DEFAULT_API_SERVER_DOMAIN = 'api.crick.dev'
DEFAULT_API_SERVER_PORT = 8000
DEFAULT_FRAMES_PATH = expanduser('~/Library/Application Support/watson/frames')
DEFAULT_N_FRAMES = 100
DEFAULT_API_ENDPOINT = '/watson/frames/bulk'


def parse_cmd_line():
    """Parse used command line and return arguments"""

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '-f', '--frames', dest='frames_path', default=DEFAULT_FRAMES_PATH,
        help="Watson frames file path (default: {})".format(
            DEFAULT_FRAMES_PATH
        )
    )
    parser.add_argument(
        '-s', '--server-domain', dest='server_domain',
        default=DEFAULT_API_SERVER_DOMAIN,
        help="Crick server domain (default: {})".format(
            DEFAULT_API_SERVER_DOMAIN
        )
    )
    parser.add_argument(
        '-p', '--port', dest='server_port', default=DEFAULT_API_SERVER_PORT,
        help="Crick server port (default: {})".format(DEFAULT_API_SERVER_PORT)
    )
    parser.add_argument(
        '-t', '--token', dest='token', help="Crick API token"
    )
    parser.add_argument(
        '-n', '--n-frames', dest='n_frames', type=int,
        default=DEFAULT_N_FRAMES,
        help=(
            "The number of latest frames to push (default: {})".format(
                DEFAULT_N_FRAMES
            )
        )
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


def validate_cmd_line(args):
    """Validate command line argument consistency"""
    logging.debug('Validating command line')

    # API token could be passed as an argument of environment variable
    if 'token' not in args or not args.token:
        check_environ(args)


def check_environ(args):
    """Check user environment"""
    if 'CRICK_API_TOKEN' not in os.environ:
        message = (
            'No API token provided, you should either use the --token '
            'argument or define a CRICK_API_TOKEN environment variable'
        )
        raise argparse.ArgumentError(args.token, message)


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


def load_frames(frames_path, n_frames=100):
    """Load Watson's frames"""
    logging.debug('Will load frames file: "{}"'.format(frames_path))

    with open(frames_path) as frames_file:
        frames = list(json.load(frames_file))
        return [_to_frame(*f) for f in frames[-n_frames:]]


def push(frames_path, server_domain, server_port, token, n_frames,
         endpoint=DEFAULT_API_ENDPOINT):
    """Push frames to the API server"""
    logging.info(
        (
            'Will push {} frames parsed from file "{}" to "http://{}:{}{}" '
            'using token starting with: {}...'
        ).format(
            n_frames, frames_path, server_domain, server_port, endpoint,
            token[:10]
        )
    )

    # Load user frames
    frames = load_frames(frames_path, n_frames=n_frames)
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
    validate_cmd_line(args)
    push(
        args.frames_path,
        args.server_domain,
        args.server_port,
        args.token or os.environ.get('CRICK_API_TOKEN'),
        args.n_frames
    )


if __name__ == '__main__':
    main()

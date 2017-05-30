crick
=====

[![CircleCI](https://circleci.com/gh/TailorDev/crick/tree/master.svg?style=svg&circle-token=af802009a9119df1eb1869418316b2d742d65dda)](https://circleci.com/gh/TailorDev/crick/tree/master)

Installation
------------

### API

Start the Docker environment (Golang and PostgreSQL containers) with the
following command lines:

    $ cd api/
    $ make dev

Be sure to apply all the migrations:

    $ make migrate-up

Get the API logs:

    $ make logs

Get help:

    $ make [help]

Stop and remove the Docker environment:

    $ make down

Load Watson's frames to your local server (python 3.4+ is required):

    $ CRICK_API_TOKEN='mytoken' python3 api/scripts/watson_push.py (-h)

### Web App

    $ cd web/
    $ yarn install
    $ make dev

Browse: http://crick.dev:3000/

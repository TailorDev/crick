crick
=====


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


### Web App

    $ cd web/
    $ yarn install
    $ make dev

Browse: http://crick.dev:3000/

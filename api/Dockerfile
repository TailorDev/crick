FROM golang:1.8-alpine
MAINTAINER William Durand <hello@tailordev.fr>

ARG app_env
ENV APP_ENV $app_env

RUN apk update && \
    apk add git && \
    rm -r /var/cache/apk/*

COPY . /go/src/github.com/TailorDev/crick/api
WORKDIR /go/src/github.com/TailorDev/crick/api

CMD if [ "${APP_ENV}" == "production" ]; \
    then \
    go build && ./api; \
    else \
    go get -u github.com/codegangsta/gin && gin --port 8000 run; \
    fi

EXPOSE 8000

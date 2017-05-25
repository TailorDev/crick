FROM golang:1.8-alpine
MAINTAINER William Durand <hello@tailordev.fr>

RUN apk update && \
    apk add git && \
    rm -r /var/cache/apk/*

# db migration tool
RUN go get -u -d github.com/mattes/migrate/cli \
                 github.com/lib/pq
RUN go build -tags 'postgres' -o /usr/local/bin/migrate github.com/mattes/migrate/cli

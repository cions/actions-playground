FROM alpine:latest

RUN apk add --no-cache bash jq util-linux

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

LABEL org.opencontainers.image.source="https://github.com/cions/actions-playground"

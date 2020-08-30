FROM alpine:latest

RUN apk add --no-cache bash jq util-linux

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

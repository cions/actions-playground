FROM golang:latest AS build

WORKDIR /go/src/app

COPY . .

RUN go build -o /go/bin/example


FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=build /go/bin/example /

CMD ["/example"]

LABEL org.opencontainers.image.source="https://github.com/cions/actions-playground"

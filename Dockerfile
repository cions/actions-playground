FROM golang:latest AS build

COPY . .

RUN go build -o /hello


FROM scratch

COPY --from=build /hello /hello

CMD ["/hello"]

FROM alpine:latest

COPY Ordner1 /App/Ordner1

RUN apk add tree

RUN tree /App

CMD ["/bin/cat", "/App/Ordner1/Datei1.txt"]
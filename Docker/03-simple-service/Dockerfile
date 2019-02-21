FROM alpine:latest

# There is a nodejs base image. But I prefer to install what I need myself
RUN apk add nodejs

# Lets run a simple nodejs webserver
COPY index.js /app/index.js

WORKDIR /app

ENTRYPOINT [ "node", "index.js" ]
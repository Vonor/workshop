FROM alpine:latest

# alpine uses busybox as default. We have to install bash ourselves
RUN apk add bash

ADD https://raw.githubusercontent.com/Vonor/workshop/master/Docker/02-simple-bashscript/container.sh /bin/
# COPY container.sh /bin/

# Make the script executable
RUN chmod +x /bin/container.sh
ENTRYPOINT [ "/bin/container.sh" ]
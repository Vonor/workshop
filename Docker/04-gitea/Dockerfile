FROM alpine:latest

# ENV PROXY STUFF
RUN apk add bash git sqlite

RUN mkdir /data

RUN addgroup \
    -S -g 1000 \
    git && \
  adduser \
    -S -D \
    -h /data/git \
    -s /bin/bash \
    -u 1000 \
    -G git \
    git && \
  echo "git:$(dd if=/dev/urandom bs=24 count=1 status=none | base64)" | chpasswd

#ADD https://github.com/go-gitea/gitea/releases/download/v1.7.2/gitea-1.7.2-linux-amd64 ./bin/gitea
COPY gitea-1.7.* /bin/gitea
RUN chmod +x /bin/gitea

VOLUME [ "/data" ]

ENV USER git
ENV GITEA_WORK_DIR /data/git

USER git

ENTRYPOINT [ "/bin/gitea" ]
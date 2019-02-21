# workshop
Docker und Kubernetes Workshop

# Docker

```Dockerfile
FROM baseimage:tag

COPY src dest

ADD src dest

WORKDIR /foo

RUN befehl

ENV key value
ENV key=value

CMD ['befehl', 'arg1', 'arg2']
ENTRYPOINT ['befehl', 'arg1', 'arg2']
```
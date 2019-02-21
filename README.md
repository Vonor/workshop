# workshop
Docker und Kubernetes Workshop

# Docker

* Container Virtualisierung
* Keine Hardware Virtualisierung
* Host unabhängies Environment
  * Gut zum bauen von verschiedenen Binär-Paketen für Verschiedene Linux Systeme
  * Ein Build Host, N Build Environments
* Zum testen von Software oder Services
  * Ohne das Host System zu kompromitieren (Library Versionen, etc.)
  * Schadsoftware kann keinen Schaden anrichten (Ähnlich Jails, chroot)
[Dokumentation für Dockerfile](https://docs.docker.com/engine/reference/builder/)


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
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

CMD ["befehl", "arg1", "arg2"]
ENTRYPOINT ["befehl", "arg1", "arg2"]
```

## Beispiel 1: simple container

In diesem Beispiel werden die Dockerfile Befehle `FROM`, `COPY`, `RUN` und `CMD` behandelt.  
Container bauen: `docker build -t 01-simple-container .`  
Container ausführen: `docker run --name 01-simple-container 01-simple-container`  
Container stoppen: `docker stop 01-simple-container`

## Beispiel 2: simple bash script

In diesem Beispiel wird der Unterschied zwischen `ADD` und `COPY` erklärt. Zusätzlich kommt `ENTRYPOINT` hinzu.  
Ein kleines Shellscript, welches anhand der verwendeten Container Destribution `git` installiert und ein Repository cloned.

## Beispiel 3: simple service

Jetzt wird es etwas interessanter. Wir installieren uns NodeJS im Container und erstellen uns einen kleinen Webserver. `WORKDIR` kommt als neue Option mit hinzu.

Hands-On Training: Environment Variablen mit `ENV` und Static File Serve mit Volumes ausserhalb des Containers.
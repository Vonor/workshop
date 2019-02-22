# Workshop

Docker und Kubernetes Workshop

- [Workshop](#workshop)
  - [Docker](#docker)
    - [Beispiel 1: simple container](#beispiel-1-simple-container)
    - [Beispiel 2: simple bash script](#beispiel-2-simple-bash-script)
    - [Beispiel 3: simple service](#beispiel-3-simple-service)
    - [Beispiel 4: Gitea](#beispiel-4-gitea)

## Docker

- Container Virtualisierung
- Keine Hardware Virtualisierung
- Host unabhängies Environment
  - Gut zum bauen von verschiedenen Binär-Paketen für Verschiedene Linux Systeme
  - Ein Build Host, N Build Environments
- Zum testen von Software oder Services
  - Ohne das Host System zu kompromitieren (Library Versionen, etc.)
  - Schadsoftware kann keinen Schaden anrichten (Ähnlich Jails, chroot)

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

### Beispiel 1: simple container

In diesem Beispiel werden die Dockerfile Befehle `FROM`, `COPY`, `RUN` und `CMD` behandelt.  
Container bauen: `docker build -t 01-simple-container .`  
Container ausführen: `docker run --name 01-simple-container 01-simple-container`  
Container stoppen: `docker stop 01-simple-container`

### Beispiel 2: simple bash script

In diesem Beispiel wird der Unterschied zwischen `ADD` und `COPY` erklärt. Zusätzlich kommt `ENTRYPOINT` hinzu.  
Ein kleines Shellscript, welches anhand der verwendeten Container Destribution `git` installiert und ein Repository cloned.  
Container bauen: `docker build -t 02-simple-bashscript .`  
Container ausführen: `docker run --name 02-simple-bashscript 02-simple-bashscript`  
Container stoppen: `docker stop 02-simple-bashscript`

### Beispiel 3: simple service

Jetzt wird es etwas interessanter. Wir installieren uns NodeJS im Container und erstellen uns einen kleinen Webserver. `WORKDIR` kommt als neue Option mit hinzu.

Container bauen: `docker build -t 03-simple-service .`  
Container ausführen: `docker run --name 03-simple-service 03-simple-service`  
Container stoppen: `docker stop 03-simple-service`

Hands-On Training: Environment Variablen mit `ENV` und Static File Serve mit Volumes ausserhalb des Containers.

### Beispiel 4: Gitea

Praktisches Beispiel mit einem "echten" Service. Daten liegen außerhalb vom Container. Verschiedene Environment Variablen. User anlegen und benutzen.

Container bauen: `docker build -t 04-gitea .`  
Container ausführen: `docker run --name 04-gitea -p 3000:3000 -v ${PWD}/data:/data --rm 04-gitea`  
Container als Deamon ausführen: `docker run --name 04-gitea -p 3000:3000 -v ${PWD}/data:/data --rm -d 04-gitea`  
Container stoppen: `docker stop 04-gitea`  

Adduser help bei alpine

```man
Usage: adduser [OPTIONS] USER [GROUP]

Create new user, or add USER to GROUP

        -h DIR          Home directory
        -g GECOS        GECOS field
        -s SHELL        Login shell
        -G GRP          Group
        -S              Create a system user
        -D              Don't assign a password
        -H              Don't create home directory
        -u UID          User id
        -k SKEL         Skeleton directory (/etc/skel)
```
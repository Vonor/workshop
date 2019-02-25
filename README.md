# Workshop

Docker und Kubernetes Workshop

(Diese Dokumentation ist für einen Firmeninternen Hands-On Workshop gedacht. Aus Datenschutzgründen wird weder die Firma genannt, noch entsprechende Verweise auf die Firma öffentlich gemacht. Die dokumentation kann daher als Allgemein betrachtet werden und von jedem benutzt werden. Etwaige verweise auf Mails oder interne Dokumentationen sind in diesem Fall zu ignorieren.)

- [Workshop](#workshop)
  - [Docker](#docker)
    - [Beispiel 1: simple container](#beispiel-1-simple-container)
    - [Beispiel 2: simple bash script](#beispiel-2-simple-bash-script)
    - [Beispiel 3: simple service](#beispiel-3-simple-service)
    - [Beispiel 4: Gitea](#beispiel-4-gitea)
    - [Best Practice](#best-practice)

## Docker

Was ist Docker

- Container Virtualisierung
- Keine Hardware Virtualisierung
- Host unabhängies Environment
  - Gut zum bauen von verschiedenen Binär-Paketen für Verschiedene Linux Systeme
  - Ein Build Host, N Build Environments
- Zum testen von Software oder Services
  - Ohne das Host System zu kompromitieren (Library Versionen, etc.)
  - Schadsoftware kann keinen Schaden anrichten (Ähnlich Jails, chroot)
- Zum bereitstellen von Services und Lifecycle-Management

Praktische Anwendung in unserer Firma?

- Apache für verschiedene Linux Distributionen kompilieren und auch gleich testen. (Siehe Apache Docker Cronjob Mails).
- Bereitstellung eines Git Services oder anderer Services
- Unser Produkt als Service bereitstellen.
  - Wrapper Script
  - Konfiguration des Produkts über Environment Variablen
  - Somit vereinfachte Bereitstellung des Produkts
  - Container Orchestrierung mit Kubernetes um unser Produkt auf Platformen wie Azure AKS, Amazon EKS oder auch Googles Kubernetes Services, Digital Ocean, etc etc. bereit zu stellen.

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

In Corporate Networks muss man unter Umständen den DNS Server mit angeben. Dies ist ein known bug wenn systemd-resolved verwendet wird. Der nachvolgende Schritt ist nur bei Docker notwendig, nicht bei Kubernetes.
Immer den Corporate DNS Server benutzen:

```SHELL
alias dr="docker run --dns 192.168.178.1"
alias db="docker build --dns 192.168.178.1"
```

Container bauen: `db -t 01-simple-container .`  
Container ausführen: `dr --name 01-simple-container 01-simple-container`  
Container stoppen: `docker stop 01-simple-container`

### Beispiel 2: simple bash script

In diesem Beispiel wird der Unterschied zwischen `ADD` und `COPY` erklärt. Zusätzlich kommt `ENTRYPOINT` hinzu.  
Ein kleines Shellscript, welches anhand der verwendeten Container Destribution `git` installiert und ein Repository cloned.  
Container bauen: `db -t 02-simple-bashscript .`  
Container ausführen: `dr --name 02-simple-bashscript 02-simple-bashscript`  
Container stoppen: `docker stop 02-simple-bashscript`

### Beispiel 3: simple service

Jetzt wird es etwas interessanter. Wir installieren uns NodeJS im Container und erstellen uns einen kleinen Webserver. `WORKDIR` kommt als neue Option mit hinzu.

Container bauen: `db -t 03-simple-service .`  
Container ausführen: `dr --name 03-simple-service 03-simple-service`  
Container stoppen: `docker stop 03-simple-service`

Hands-On Training: Environment Variablen mit `ENV` und Static File Serve mit Volumes ausserhalb des Containers.

### Beispiel 4: Gitea

Praktisches Beispiel mit einem "echten" Service. Daten liegen außerhalb vom Container. Verschiedene Environment Variablen. User anlegen und benutzen.

Container bauen: `db -t 04-gitea .`  
Container ausführen: `dr --name 04-gitea -p 3000:3000 -v ${PWD}/data:/data --rm 04-gitea`  
Container als Deamon ausführen: `dr --name 04-gitea -p 3000:3000 -v ${PWD}/data:/data --rm -d 04-gitea`  
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

### Best Practice

Es empfiehlt sich immer ein Wrapper Script als `ENTRYPOINT` bereitzustellen, welches wichtige Aufgaben übernimmt.

- Environment Variablen auslesen und Konfigurationsdateien erstellen/anpassen
- UNIX Signale (man kill) abfangen (trap --help) um einen clean shutdown zu gewährleisten
- Die eigentlichen Services starten und ggfs. erneut starten.

## Kubernetes

Kubernetes stellt die Orchestration für Docker Container dar.

- Verteilte Systeme möglich
  - Bei Docker können nur Container auf dem selben Host miteinander kommunizieren
- Master / Node Prinzip
- Eigene Netzwerk Infrastruktur

### Setup Mast und Node hinzufügen

Kubernetes erwartet, dass SWAP deaktiviert ist.  

```SHELL
sed -i 's@^/swapfile.*@@' /etc/fstab
swapoff -a
free -m # Zum Überprüfen
```
`kubeadm` ist der zentrale Verwaltungsbefehl. Mit diesem wird der Cluster initialisiert und gemanaged.  
`kubectl` ist der zentrale Befehl um die Inhalte im Cluster zu managen.

Cluster Initialisieren: `kubeadm init`  
Für bestimmte Netzwerk Plugins muss das Pod Network noch angegeben werden. Wir verwenden Flannel. Deshalb müssen wir das Netzwerk `10.244.0.0/16` verwenden.

Cluster Init: `kubeadm init --pod-network-cidr=10.244.0.0/16`

```SHELL
root@k8s-master:~# kubeadm init --pod-network-cidr=10.244.0.0/16
[init] Using Kubernetes version: v1.13.3
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.178.25 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s-master localhost] and IPs [192.168.178.25 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s-master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.178.25]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 20.017922 seconds
[uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.13" in namespace kube-system with the configuration for the kubelets in the cluster
[patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "k8s-master" as an annotation
[mark-control-plane] Marking the node k8s-master as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node k8s-master as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: 0ewjq8.9lw8474hzglpipv7
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes master has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join 192.168.178.25:6443 --token 0ewjq8.9lw8474hzglpipv7 --discovery-token-ca-cert-hash sha256:7a7d337908064481f1aa5888d4dabf6edef797dc91b0d834e68176b07e3f5da5

root@k8s-master:~#
```

### Den Cluster als User verwalten

```SHELL
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### kubectl Befehle

`kubectl get` um den Cluster nach bestimmten Optionen zu fragen.
`kubectl apply` um dem Cluster eine Konfigurationsdatei hinzuzufügen

### Netzwerk Plugin hinzufügen

Schauen wir uns jetzt die Hosts im Cluster an, werden wir sehen, dass alle Nodes im Status "NotReady" sind.

```SHELL
kubectl get nodes
NAME         STATUS     ROLES    AGE     VERSION
k8s-master   NotReady   master   7m42s   v1.13.3
k8s-node     NotReady   <none>   10s     v1.13.3
```

Wie bereits erwähnt werden wir Flannel benutzen. Dieses Plugin müssen wir dem Cluster jetzt hinzufügen.

`kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/a70459be0084506e4ec919aa1c114638878db11b/Documentation/kube-flannel.yml`

Schauen wir ob es funktioniert hat.

```SHELL
$ kubectl get all -o wide -n kube-system
NAME                                     READY   STATUS    RESTARTS   AGE     IP               NODE         NOMINATED NODE   READINESS GATES
pod/coredns-86c58d9df4-mv9g6             1/1     Running   0          13m     10.244.1.2       k8s-node     <none>           <none>
pod/coredns-86c58d9df4-s4m2v             1/1     Running   0          13m     10.244.0.2       k8s-master   <none>           <none>
pod/etcd-k8s-master                      1/1     Running   0          12m     192.168.178.25   k8s-master   <none>           <none>
pod/kube-apiserver-k8s-master            1/1     Running   0          12m     192.168.178.25   k8s-master   <none>           <none>
pod/kube-controller-manager-k8s-master   1/1     Running   0          12m     192.168.178.25   k8s-master   <none>           <none>
pod/kube-flannel-ds-amd64-kf52d          1/1     Running   0          35s     192.168.178.26   k8s-node     <none>           <none>
pod/kube-flannel-ds-amd64-mh9qx          1/1     Running   0          35s     192.168.178.25   k8s-master   <none>           <none>
pod/kube-proxy-9sfqc                     1/1     Running   0          6m13s   192.168.178.26   k8s-node     <none>           <none>
pod/kube-proxy-zqlpk                     1/1     Running   0          13m     192.168.178.25   k8s-master   <none>           <none>
pod/kube-scheduler-k8s-master            1/1     Running   0          12m     192.168.178.25   k8s-master   <none>           <none>

NAME               TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE   SELECTOR
service/kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP   13m   k8s-app=kube-dns

NAME                                     DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                     AGE   CONTAINERS     IMAGES                                   SELECTOR
daemonset.apps/kube-flannel-ds-amd64     2         2         2       2            2           beta.kubernetes.io/arch=amd64     35s   kube-flannel   quay.io/coreos/flannel:v0.11.0-amd64     app=flannel,tier=node
daemonset.apps/kube-flannel-ds-arm       0         0         0       0            0           beta.kubernetes.io/arch=arm       35s   kube-flannel   quay.io/coreos/flannel:v0.11.0-arm       app=flannel,tier=node
daemonset.apps/kube-flannel-ds-arm64     0         0         0       0            0           beta.kubernetes.io/arch=arm64     35s   kube-flannel   quay.io/coreos/flannel:v0.11.0-arm64     app=flannel,tier=node
daemonset.apps/kube-flannel-ds-ppc64le   0         0         0       0            0           beta.kubernetes.io/arch=ppc64le   34s   kube-flannel   quay.io/coreos/flannel:v0.11.0-ppc64le   app=flannel,tier=node
daemonset.apps/kube-flannel-ds-s390x     0         0         0       0            0           beta.kubernetes.io/arch=s390x     34s   kube-flannel   quay.io/coreos/flannel:v0.11.0-s390x     app=flannel,tier=node
daemonset.apps/kube-proxy                2         2         2       2            2           <none>                            13m   kube-proxy     k8s.gcr.io/kube-proxy:v1.13.3            k8s-app=kube-proxy

NAME                      READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES                     SELECTOR
deployment.apps/coredns   2/2     2            2           13m   coredns      k8s.gcr.io/coredns:1.2.6   k8s-app=kube-dns

NAME                                 DESIRED   CURRENT   READY   AGE   CONTAINERS   IMAGES                     SELECTOR
replicaset.apps/coredns-86c58d9df4   2         2         2       13m   coredns      k8s.gcr.io/coredns:1.2.6   k8s-app=kube-dns,pod-template-hash=86c58d9df4
```

```SHELL
$ kubectl get nodes
NAME         STATUS   ROLES    AGE     VERSION
k8s-master   Ready    master   14m     v1.13.3
k8s-node     Ready    <none>   7m21s   v1.13.3
```

### Taint master

Damit wir in unserem Lab auch Container (Pods) auf dem Master ausrollen können, müssen wir den Cluster tainten.

`kubectl taint nodes --all node-role.kubernetes.io/master-`

### Setup persistent storage

Damit Daten persistent gespeichert werden können, gibt es bei Kubernetes persistent Volumes (PV). Wir beschränken uns auf `hostPath`.  
Es gibt auch noch andere Storage Classes, auf die werde ich hier aber nicht eingehen. Alleine hierfür könnte man mehrere Workshops ansetzen. Beispiele wären NFS, Amazon S3, GlusterFS, etc.

Da wir den VBox Shared Folder auf allen VMs eingerichtet haben, bietet es sich an, genau diesen als Storage für K8s zu benutzen. Siehe `01-storage-mysql.yaml`

Erstellen wir uns zunächst ein Storage für MySQL: `kubectl apply -f 01-storage-mysql.yaml`  

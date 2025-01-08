## Deploy with docker compose and sh
```
chmod +x reinicio.sh
sh reinicio.sh
```
## Deploy with docker compose

```
$ docker compose up -d
```
## Expected result

Listing containers must show containers running and the port mapping as below:

```
$ docker ps

CONTAINER ID   IMAGE                  COMMAND                  CREATED              STATUS              PORTS                               NAMES
b6d00a4974ce   react-nginx_frontend   "nginx -g 'daemon of…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, :::80->80/tcp   frontend
```

After the application start, navigate to http://localhost in your browser:
![page](./output.png)

Stop and remove the containers

```
$ docker compose down
```

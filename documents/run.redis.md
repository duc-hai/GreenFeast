This following command will pull docker image Redis and run container in local:
```
docker run --name redis -p 6379:6379 -it redis/redis-stack-server:latest
```
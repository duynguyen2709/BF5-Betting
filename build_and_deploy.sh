#!/bin/bash

echo "################ Start deploying backend ################"

# Build java code
mvn clean package
if [ $? -ne 0 ]; then
  echo "!!! mvn clean package failed !!!"
  exit 1
fi

# Build the Docker image
docker build --platform=linux/amd64 -t duyna5/bf5-betting-unoptimized .
if [ $? -ne 0 ]; then
  echo "!!! Docker build failed !!!"
  exit 1
fi

# Optimize image with slim
source .env
echo "MYSQL_USERNAME = $MYSQL_USERNAME"
echo "MYSQL_PASSWORD = $MYSQL_PASSWORD"
echo "MYSQL_HOST = $MYSQL_HOST"
echo "MYSQL_DATABASE = $MYSQL_DATABASE"
echo "TZ = $TZ"
slim build --preserve-path-file slim_ignore_java.txt --target duyna5/bf5-betting-unoptimized:latest --tag duyna5/bf5-betting:latest --env TZ=Asia/Ho_Chi_Minh --env MYSQL_USERNAME=$MYSQL_USERNAME --env MYSQL_PASSWORD=$MYSQL_PASSWORD --env MYSQL_HOST=$MYSQL_HOST --env MYSQL_DATABASE=$MYSQL_DATABASE
if [ $? -ne 0 ]; then
  echo "!!! Slim build failed !!!"
  exit 1
fi

# Transfer image to host
docker save duyna5/bf5-betting | gzip | pv | ssh -C root@139.180.191.134 "gunzip | docker load"
if [ $? -ne 0 ]; then
  echo "!!! Docker image transfer failed !!!"
  exit 1
fi

# Restart service with new image
TARGET_USER="root"
TARGET_HOST="139.180.191.134"
REMOTE_COMMANDS="
  cd betting &&
  docker compose down &&
  yes | docker image prune &&
  docker compose up -d
"

ssh "${TARGET_USER}@${TARGET_HOST}" "${REMOTE_COMMANDS}"
if [ $? -ne 0 ]; then
  echo "!!! SSH deploy failed !!!"
  exit 1
fi

# Remove old images
yes | docker image prune && docker image rm duyna5/bf5-betting-unoptimized:latest
if [ $? -ne 0 ]; then
  echo "!!! Prune old images failed !!!"
  exit 1
fi

echo "################ Deployed backend successfully ################"

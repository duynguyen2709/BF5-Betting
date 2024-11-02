#!/bin/bash

# Navigate to the specified directory
cd src/main/webapp-v2
if [ $? -ne 0 ]; then
  echo "Failed to change directory to src/main/webapp-v2"
  exit 1
fi

# Run npm build
npm run build
if [ $? -ne 0 ]; then
  echo "npm run build failed"
  exit 1
fi

# Navigate back to the root directory
cd ../../..
if [ $? -ne 0 ]; then
  echo "Failed to change directory to project root"
  exit 1
fi

# Run Maven clean install
mvn clean install
if [ $? -ne 0 ]; then
  echo "mvn clean install failed"
  exit 1
fi

# Build the Docker image
docker build --platform=linux/amd64 --no-cache -t duyna5/bf5-betting .
if [ $? -ne 0 ]; then
  echo "Docker build failed"
  exit 1
fi

docker save duyna5/bf5-betting | ssh -C root@139.180.191.134 docker load
if [ $? -ne 0 ]; then
  echo "Docker save failed"
  exit 1
fi

echo "All commands executed successfully"

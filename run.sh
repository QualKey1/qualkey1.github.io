#!/bin/bash
cd /home/ec2-user/qualkey
docker-compose build --no-cache
docker-compose up -d
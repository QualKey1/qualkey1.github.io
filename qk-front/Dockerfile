#Creates a layer from node:alpine image.
FROM node:12.22.9-alpine

#Creates directories
RUN mkdir -p /usr/src/app

#Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY, and ADD commands
WORKDIR /usr/src/app

#Copy new files or directories into the filesystem of the container
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

#Execute commands in a new layer on top of the current image and commit the results
RUN npm install

##Copy new files or directories into the filesystem of the container
COPY . /usr/src/app

#Allows you to configure a container that will run as an executable
ENTRYPOINT ["npm", "run"]
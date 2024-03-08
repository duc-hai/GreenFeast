FROM node:20-alpine 
# node is image name, version 20, alpine is the version of node, reduces the library -> helps reduce capacity

WORKDIR /greenfeast/apigateway
# where to store source code, if it does not exist, it will be created automatically

COPY package*.json ./
# copy package, package-lock json, copy these 2 files and source code into docker
# only when the package.json file changes, then run npm install below (taking advantage of the data caching mechanism)

RUN npm install

COPY . .
# the first dot is the path of the current directory where the Dockerfile is located
# the second dot is the path of the directory containing the source code in docker, which is the "workdir" above

#RUN npm run build-src

CMD ["npm", "run", "begin"]

EXPOSE 3000

# Build docker image (node-app-name is docker image name, dot is build docker image at current directory):

# docker build -t node-app-name .
# docker images # show docker images 

# Run image: 

# docker run -p 3000:3000 -d node-app-name
# docker ps # show docker process

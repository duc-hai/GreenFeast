FROM node:20-alpine AS build

WORKDIR /appreact

COPY package*.json ./

RUN npm install

COPY . .

#For server EC2
RUN export NODE_OPTIONS="--max_old_space_size=4096"  && npm run build

# Nginx
FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

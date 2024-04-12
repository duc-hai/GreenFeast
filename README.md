<h1 align="center">Green Feast</h1>

<div align="center">

![Static Badge](https://img.shields.io/badge/Javascript-yellow)
![Static Badge](https://img.shields.io/badge/Typescript-blue)
![Static Badge](https://img.shields.io/badge/Backend-ExpressJS-darkgreen)
![Static Badge](https://img.shields.io/badge/Backend-NestJS-red)
![Static Badge](https://img.shields.io/badge/Frontend-ReactJS-lightblue)
![Static Badge](https://img.shields.io/badge/Layout-Boostrap-purple)
![Static Badge](https://img.shields.io/badge/Deploy-Docker-blue)

</div>

## 📤 Web Deployment 
- Client: [https://greenfeast.space](https://greenfeast.space/)
- Management: [https://greenfeast.space/login](https://greenfeast.space/login) 
  - Username: 0123456789, password: 123456
  - Select the "Login admin" box to enter the management page

## 📑 Technologies & Skills 
- Microservice architecture
- API Gateway: Express.js, MongoDB
- Management Service: NestJS, MySQL
- Order Service: Express.js, MongoDB
- Frontend: ReactJS, Boostrap
- Docker, Rabbit MQ
- Json Web Token, Access control RBAC, Tracking Logs (winston) 
- Deploy with EC2 AWS, DNS was managed by Cloudflare

## 📋 Introduction
This project analyzes the design of a system to support ordering and managing information for a vegetarian restaurant. The aim of the project is to enhance customer interaction with the system for easy ordering and enable the restaurant to efficiently manage information. Diners at the restaurant can scan a QR code to place orders directly on their personal mobile phones. The restaurant can manage order information, menu details, invoices, and revenue. This helps improve work efficiency and reduces tasks compared to traditional methods. The scope of the project is to implement it within a large-scale restaurant chain system, with high app access, especially during peak hours, and multiple functionalities. To meet these requirements, we deployed the system with a microservices architecture, dividing the application into small, independent services. These services utilize Node.js frameworks such as Express.js and NestJS. The frontend employs the React.js library. Services can communicate with each other through RabbitMQ message queues. During application deployment, RBAC model to access control, security rules, encryption, and error logging methods were applied to monitor system activities. The website is deployed on Amazon Web Service's EC2 platform and utilizes Docker to package services into containers for production environments. Domain name system services are managed by Cloudflare. 

Use-case diagram: [here](https://res.cloudinary.com/dmjsmmt3h/image/upload/v1711949801/yiohyvczyhceauijyrun.png)

UX/UI Design (Figma): [here](https://s.net.vn/ztMs)

Report Link (**important**): [here](https://drive.google.com/file/d/1OpKQy8AnA73VwCTqTG8uhACv__ZLPBvf/view?usp=sharing)

## 📖 System Architecture
<p align="center">
  <img src="https://res.cloudinary.com/dmjsmmt3h/image/upload/v1710858461/ulffgbp5rp3a3ggciwus.png" />
</p>

## 📝 API Document 
**API Document Official Directly**: You can see the api document directly at [here](https://app.swaggerhub.com/apis-docs/HaiLuu/GreenFeast/1.0.0)
> [!TIP]
> Another way, you can also use `api-document.yaml` file to read. To view api document as an interface, you can download the `OpenAPI (Swagger) Editor` extension in VSCode, then open `api-document.yaml` file and click the OpenAPI button in the upper right corner (or use the `Shift + Alt + P` hotkey). The last way is copy, paste contents from this file to sites [Swagger Editor](https://editor.swagger.io/)

## 📦 Installation 
To run this project on local, you need to install Docker and Node.js (Database, Rabbit MQ will be installed automatic on Docker server with images pulled from Docker Hub)

## 💾 Run Docker & Add Sample Data for Database 
1. We set up project front end in `cd frontend` with command `npm install` and `npm run build`. Notes: If you want to increase the memory usage of the node globally - not only single script (could be applied on Ubuntu EC2), you can export environment variable, like this: 
   
   ```
   export NODE_OPTIONS=--max_old_space_size=4096
   ```
2. We need to run the docker compose in `cd api-gateway/docker/production` first with the following command: 
   
   ```
   docker compose -p apigateway-mongodb-nginx up -d 
   ```
   Then, copy data from local to mongo storage container:
   
   ```
   docker cp ../../database/ apiGatewayDB:/data/
   ```   
   And use mongo import in order to import sample data:
   
   ```
   docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection roles --type json --file /data/database/roles.json --jsonArray
   ```

   ```
   docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection accounts --type json --file /data/database/accounts.json --jsonArray
   ```

   ```
   docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection users --type json --file /data/database/users.json --jsonArray
   ```
3. Run Rabbit MQ Container in `cd docker-rabbitmq` with command:
   
   ```
   docker compose -p rabbitmq up -d 
   ```
4. Then, we run docker compose in order service (path `cd order-service/docker`):
   
   ```
   docker compose -p order-mongodb up -d 
   ```

   Then, copy data from local to mongo storage container:
   
   ```
   docker cp ../database/ orderDB:/data/
   ```   
   And use mongo import in order to import sample data:
   
   ```
   docker exec orderDB mongoimport --host orderDB --db order --collection areas --type json --file /data/database/areas.json --jsonArray --port 27018
   ```

   ```
   docker exec orderDB mongoimport --host orderDB --db order --collection categories --type json --file /data/database/categories.json --jsonArray --port 27018
   ```

   ```
   docker exec orderDB mongoimport --host orderDB --db order --collection menus --type json --file /data/database/menus.json --jsonArray --port 27018
   ```

   ```
   docker exec orderDB mongoimport --host orderDB --db order --collection printers --type json --file /data/database/printers.json --jsonArray --port 27018
   ```

   ```
   docker exec orderDB mongoimport --host orderDB --db order --collection orders --type json --file /data/database/orders.json --jsonArray --port 27018
   ```
5. Finally, run docker compose at `cd management-service/docker` with:

    ```
    docker compose -p management-mysql up -d
    ```
And now, website is running at: [http://localhost](http://localhost)
Employee account: 0123456789 / 123456 (admin role with full access)

## 👥 Authors & Role
<div style="display:inline-block">
  <a href="https://github.com/duc-hai">
    <img src="https://github.com/duc-hai.png" style="border-radius: 50%;" alt="Avatar" width="50" height="50">
  </a>
  <a href="https://github.com/ngtram56">
    <img src="https://github.com/ngtram56.png" style="border-radius: 50%;" alt="Avatar" width="50" height="50">
  </a>
</div>

**1**. **Luu Duc Hai** (Leader): BA, System Architect, Backend, DevOps </br>
Come up with ideas, analyze design requirements, specifications, build use-case diagrams, design databases, build system architecture, complete the entire backend part of the website (all folders except frontend folder in source code structure), manage domain name, transfer management to cloudflare, write docker compose configuration, work with ubuntu OS on EC2 in order to deploy website.

**2**. **Truong Thi Ngan Tram**: BA, Frontend, UX/UI Design </br>
Come up with ideas, analyze design requirements, specifications, write use-case specifications, design ux/ui user interface with figma, complete the entire frontend part (frontend folder)

## ❤️ Thanks 
I would like to express my deep gratitude to my lecturers at Ton Duc Thang University. I learned a lot of useful knowledge from the subjects that the lecturers taught. I applied knowledge from many subjects to this project. Sincere appreciation to lecturers.

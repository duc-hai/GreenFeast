<h1 align="center">Green Feast</h1>

<div align="center">

![Static Badge](https://img.shields.io/badge/Javascript-yellow)
![Static Badge](https://img.shields.io/badge/Typescript-blue)
![Static Badge](https://img.shields.io/badge/Backend-ExpressJS-darkgreen)
![Static Badge](https://img.shields.io/badge/Backend-NestJS-red)
![Static Badge](https://img.shields.io/badge/Backend-Flask-blue)
![Static Badge](https://img.shields.io/badge/Frontend-ReactJS-lightblue)
![Static Badge](https://img.shields.io/badge/Deploy-Docker-blue)
![Static Badge](https://img.shields.io/badge/Cache-Redis-red)
![Static Badge](https://img.shields.io/badge/Queue-RabbitMQ-orange)

</div>

## 📤 Web Deployment 
- Client: [https://greenfeast.space](https://greenfeast.space/)
- Management: [https://greenfeast.space/login](https://greenfeast.space/login) 
  - Username: 0123456789, password: 123456
  - Select the "Login admin" box to enter the management page
- Demo script: [here](https://docs.google.com/document/d/151-uFlub3Yi4Z00npQgpLE7smJBD51eRycYk7ldC_tI/edit?usp=sharing)
- VNPay test card information for payment feature: [here](https://sandbox.vnpayment.vn/apis/vnpay-demo/)
- API Document for TMS: [here](https://greenfeast.space/tms/docs)

## 📑 Technologies & Skills 
- Microservice architecture, BFF Pattern, Load balacing for order service
- Express.js, NestJS, MongoDB, MySQL, Flask
- Frontend: ReactJS
- Docker, Rabbit MQ
- Deploy with EC2 AWS, DNS was managed by Cloudflare, config CI/CD with Github Actions
- LightGCN and LightGBM deep learning models for food recommendations
- Json Web Token, Access control RBAC, Tracking Logs (winston), push notification SocketIO, VNPay integration, login with Google,...

## 📋 Introduction
This thesis analyzes and designs a system that supports food ordering and manages the information of a vegetarian restaurant. The objective is to enhance customer interaction with the system, making it easy for users to place orders, either in person or online via the restaurant's website. Customers dining at the restaurant can scan a QR code to place orders directly on their mobile phone. Additionally, online orders can be placed via the website, with delivery handled by the TMS shipping unit. The restaurant can manage order information, dishes, invoices, as well as business reports. The LightGCN and LightGBM models are applied to build a food recommendations. LightGCN is based on neighbor user interactions, while LightGBM considers both user and food features for recommendations. To meet the demands of a large-scale restaurant with high traffic and numerous features, we implemented the system using a microservices architecture, separating the application into independently functioning services. The frameworks used include Express.js and Nest.js for Node.js, alongside Flask for Python. The frontend is built with the React.js library. Services communicate via RabbitMQ message queues and Redis is used for improved response times. The system employs two instances of the ordering service with load balancing using the Round Robin algorithm. During the application deployment, RBAC role-based access control, JWT security, Google login, push notifications with SocketIO, VNPay payment integration, API exposure for the shipping unit, and system activity log tracking methods were applied. The website is deployed on the Amazon EC2 platform, uses Docker to package services into containers for production environments and config CI/CD to deploy automatically. Domain name is managed by Cloudflare. The application is primarily deployed on the web platform, with a minor portion on mobile.

Use-case diagram: [here](https://drive.google.com/file/d/1KPw7t9B74QQZjmLroM4SeeZr6i0U6QMp/view?usp=sharing)

UX/UI Design (Figma): [here](https://s.net.vn/ztMs)

Report Link (**important**): [here]()

## 📖 System Architecture
<p align="center">
  <img src="https://res.cloudinary.com/dmjsmmt3h/image/upload/v1724347534/qwznxe1miwhydlbabcgf.png" />
</p>

## 📝 API Document 
**Swagger API Document for production url:** You can view and run the API docs directly with the destination server url *greenfeast.space* in production environment at [here](https://app.swaggerhub.com/apis-docs/HaiLuu/GreenFeast/1.0.0)

**Swagger API Document for development url:** You can also view and run the API docs with development url with *localhost* at: [here](https://petstore.swagger.io/?url=https://api.swaggerhub.com/apis/HaiLuu/GreenFeast/1.0.0)

## 📦 Installation 
To run this project on local, you need to install Docker [here](https://www.docker.com/) (Node.js, Flask, Database, Rabbit MQ, Redis, tensorflow,... will be installed automatic on Docker server with images pulled from Docker Hub)

## 💾 Run Docker 
**Quick start on localhost (recommend for testing purpose):** you can run project with only one file docker-compose with the following command:

```
docker compose -f docker-compose-develop.yaml -p greenfeast up -d --build
```

And now, website is running at: [http://localhost](http://localhost)

**Build in production:** If you run website on production enviroment, you can use this following command:

```
docker compose -p greenfeast up -d --build
```

**Running the backend part:** You can also run backend part with these following commands, remember that you installed Node.js before:

```
npm run init
```

The above command only needs to be executed once. And then, we need to install essential packages:

```
npm run install
```

The final step is run the whole backend services (exept recommend service):

```
npm run all
```

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
Come up with ideas, analyze design requirements, specifications, build use-case diagrams, design databases, build system architecture, complete the entire backend part of the website (all folders except frontend, mobile folder in source code structure), manage domain name, transfer management to cloudflare, write docker compose configuration, work with ubuntu OS on EC2 in order to deploy website, implement recommender models

**2**. **Truong Thi Ngan Tram**: BA, Frontend, UX/UI Design </br>
Come up with ideas, analyze design requirements, specifications, write use-case specifications, design ux/ui user interface with figma, complete the entire frontend part (frontend folder) and mobile part (mobile folder)

## ❤️ Thanks 
I would like to express my deep gratitude to my lecturers at Ton Duc Thang University. I learned a lot of useful knowledge from the subjects that the lecturers taught. I applied knowledge from many subjects to this project. Sincere appreciation to lecturers.
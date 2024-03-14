# Green Feast
- I'm going to introduce this project soon...
- README syntax: [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

## API Document
**API Document Official Directly**: You can see the api document directly at [here](https://app.swaggerhub.com/apis-docs/HaiLuu/GreenFeast/1.0.0)
> You can also use `api-document.yaml` file to read. To view api document as an interface, you can download the `OpenAPI (Swagger) Editor` extension in VSCode, then open `api-document.yaml` file and click the OpenAPI button in the upper right corner (or use the `Shift + Alt + P` hotkey). Another way is copy, paste contents from this file to sites [Swagger Editor](https://editor.swagger.io/)

## Installation
- To run this project, we need to install Docker and Node.js (Database, Rabbit MQ will be installed automatic on Docker server with images pulled from Docker Hub)

## Docker Run & Add Sample Data
1. We set up project front end in `cd frontend` with command `npm install` and `npm run build`. Notes: If you want to increase the memory usage of the node globally - not only single script, you can export environment variable, like this: 
   
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
5. Finally, run docker compose at `cd management-service/docker` with:

    ```
    docker compose -p management-mysql up -d
    ```

## Account
- Employee account: 0123456789 / 123456 (admin role with full access)

# Lưu ý khi code 
- Các đường link call api, username, password, ... nên để riêng ra file .env để tiện chỉnh sửa, không hard code. Sau này deploy website cũng sẽ tiện config lại hơn.
- Comment source code nếu logic, phân chia phức tạp, sau này nhìn lại dễ hiểu, dễ teamwork
- Phát triển các feature trên git branch riêng, có thể tạo các pull requests
- ...
- README syntax: [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

## API Document
**API Document Official Directly**: You can see the api document directly at [here](https://app.swaggerhub.com/apis/HaiLuu/GreenFeast/1.0.0)
> You can also use `api-document.yaml` file to read. To view api document as an interface, you can download the `OpenAPI (Swagger) Editor` extension in VSCode, then open `api-document.yaml` file and click the OpenAPI button in the upper right corner (or use the `Shift + Alt + P` hotkey). Another way is copy, paste content from this file to sites [Swagger Editor](https://editor.swagger.io/)

## Docker Run & Add Sample Data
1. We need to run the docker compose in `cd api-gateway/docker/production` first with the following command: 
   
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
2. Run Rabbit MQ Container in `cd docker-rabbitmq` with command:
   
   ```
   docker compose -p rabbitmq up -d 
   ```
3. Then, we run docker compose in order service (path `cd order-service/docker`):
   
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
4. Finally, run docker compose at `cd management-service/docker` with:

    ```
    docker compose -p management-mysql up -d
    ```

## Account
- Employee account: 0123456789 / 123456 (admin role with full access)

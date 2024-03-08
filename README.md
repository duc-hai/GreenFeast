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
1. We need to run the docker compose in `api-gateway/docker/production` first with the following command: 
   
   ```
   docker compose -p apigateway-mongodb-nginx up -d 
   ```
   Then, copy data from local to mongo storage container:
   
   ```
   docker cp ../../database/* apiGatewayDB:/data/
   ```   
   And use mongo import in order to import sample data:
   
   ```
   docker exec apiGatewayDB mongoimport --host apiGatewayDB --db api-gateway --collection roles --type json --file /data/roles.json --jsonArray
   ```
2. Run Rabbit MQ Container in `docker-rabbitmq` with command:
   
   ```
   docker compose -p rabbitmq up -d 
   ```
3. Then, we run docker compose in order service (path `order/docker`):
   
   ```
   docker compose -p order-mongodb up -d 
   ```
4. Finally, run docker compose at `management-service/docker` with:

    ```
    docker compose -p management-mysql up -d
    ```

## Account
- Employee account: 0123456789 / 123456 (admin role with full access)

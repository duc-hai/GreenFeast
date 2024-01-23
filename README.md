# Lưu ý khi code 
- Các đường link call api, username, password, ... nên để riêng ra file .env để tiện chỉnh sửa, không hard code. Sau này deploy website cũng sẽ tiện config lại hơn.
- Comment source code nếu logic, phân chia phức tạp, sau này nhìn lại dễ hiểu, dễ teamwork
- Phát triển các feature trên git branch riêng, có thể tạo các pull requests
- ...
- README syntax: [here](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

## API Document
To view api document as an interface, you can download the OpenAPI (Swagger) Editor extension in VSCode, then open `api-document.yaml` file and click the OpenAPI button in the upper right corner (or use the `Shift + Alt + P` hotkey). Another way is copy, paste content from this file to sites [Swagger Editor](https://editor.swagger.io/)
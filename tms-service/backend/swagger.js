const swaggerAutogen = require('swagger-autogen')()
require('dotenv').config()

const doc = {
  info: {
    title: 'Tài liệu API cho đơn vị vận chuyển',
    description: 'Description'
  },
  schemes: [process.env.SWAGGER_SCHEMES],
  host: process.env.API_GATEWAY_URL,
  tags: [  
    {
      "name": "Auth",
      "description": "Xác thực tài khoản và lấy API Key"
    },
    {
      "name": "Receive Order",
      "description": "Đơn vị vận chuyển sẽ cấu hình đường dẫn API để nhận thông tin đơn hàng từ nhà hàng"
    },
    {
      "name": "Order",
      "description": "Thao tác với thông tin của đơn hàng"
    }
  ],
  securityDefinitions: {
    apiKeyAuth: { // This name should match the key in your route comment
      type: 'apiKey',
      in: 'header', // The location of the API key (header is a common location)
      name: 'Authorization', // The name of the header to be used
      description: "Please enter JWT with Bearer into field"
    }
  }
}

const outputFile = './swagger-output.json'
const routes = ['./routes/*.js']

swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Swagger documentation generated successfully.')
})
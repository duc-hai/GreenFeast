const swaggerAutogen = require('swagger-autogen')()
require('dotenv').config()

const doc = {
  info: {
    title: 'Tài liệu API cho đơn vị vận chuyển',
    description: 'Đây là tài liệu API sử dụng cho đơn vị vận chuyển các đơn hàng tại nhà hàng. Nhà hàng chỉ sử dụng một đơn vị vận chuyển duy nhất để giao các đơn hàng đến thực khách. Để bắt đầu sử dụng, vui lòng liên hệ với quản lý nhà hàng để được cấp tài khoản, mật khẩu và cấu hình endpoint API nhận đơn hàng từ nhà hàng.'
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
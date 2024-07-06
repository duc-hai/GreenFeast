const swaggerAutogen = require('swagger-autogen')()
require('dotenv').config()

const doc = {
  info: {
    title: 'My API for TMS Delivery',
    description: 'Description'
  },
  schemes: ['http'],
  host: process.env.API_GATEWAY_URL,
  tags: [  
    {
      "name": "Tms",
      "description": "Endpoints related to user as well as account operations"
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
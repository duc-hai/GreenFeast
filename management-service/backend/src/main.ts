import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false }); //abortOnError option is used to show errors instead of the default exiting application with code 1 if there is an error
  //app.use(logger); //Link middleware with all registed path
  app.useGlobalPipes(new ValidationPipe({
    //disableErrorMessages: true,
    whitelist: true, //All field is not exist in dto will be discard
    enableDebugMessages: true, //Print error message in console
    errorHttpStatusCode: HttpStatus.FORBIDDEN, //Default is 400 BAD REQUEST
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
      //Code handle show multiple errors:
      // const errorMessages = errors.map(error => {
      //   return {
      //       field: error.property,
      //       message: Object.values(error.constraints).join(', '),
      //   };
      // });
      //return new BadRequestException({ errors: errorMessages });
      const errorField = errors[0].property //Just get error of first message
      const errorMessage = Object.values(errors[0].constraints)
      return new HttpException({
        status: 'error',
        message: `${errorField} error: ${errorMessage}`,
      }, HttpStatus.FORBIDDEN, {
        cause: errors[0] 
      })
    }
  }))
  const PORT = process.env.PORT || 4000 //Get port from .env file
  await app.listen(PORT);
  console.log(`Website is running at http://localhost:${PORT}`)
}
bootstrap();

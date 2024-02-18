import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

//Hoặc export 1 function thay vì 1 class
// import { Request, Response, NextFunction } from 'express';

// export function logger(req: Request, res: Response, next: NextFunction) {
//   console.log(`Request...`);
//   next();
// };

//Dùng nó trong app.module như cách kia:
//app.module.ts

// consumer
//   .apply(logger)
//   .forRoutes(CatsController);

import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
    catch (exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        res.status(404).json({
            status: 'error',
            message: 'Không tìm thấy đường dẫn hợp lệ',
          });
    }
}
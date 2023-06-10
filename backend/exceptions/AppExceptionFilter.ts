import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let body: { statusCode?: number; message?: string } = {};

    body.statusCode = exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    body.message = exception.message;
    httpAdapter.reply(ctx.getResponse(), body, body.statusCode);
    return;
  }
}

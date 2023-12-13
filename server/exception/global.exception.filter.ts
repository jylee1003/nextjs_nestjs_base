import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NextRequest, NextResponse } from 'next/server';
import { QueryFailedError } from "typeorm";
import { Prisma } from '@prisma/client';

@Catch() // ()를 공란으로 두어 모든 예외처리를 받을 수 있도록 하였다.
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<NextResponse>();
    const request = ctx.getRequest<NextRequest>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let code = 'HttpException';

    switch(exception.constructor) {
      case HttpException:	// for HttpException
        status = (exception as HttpException).getStatus();
        break;

      case QueryFailedError:  // for TypeOrm error
        status = HttpStatus.UNPROCESSABLE_ENTITY
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;

      case Prisma.PrismaClientKnownRequestError:  // for Prism error
        status = HttpStatus.UNPROCESSABLE_ENTITY
        message = (exception as Prisma.PrismaClientKnownRequestError).message;
        code = (exception as any).code;
        break;

      default: // default
          status = HttpStatus.INTERNAL_SERVER_ERROR
}
    response
      .status(status)
      .json({
        statusCode: status,
        message: (exception as any).message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
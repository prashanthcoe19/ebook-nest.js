import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionTitleList } from '../constants/expection-title-list';

export class CustomHttpException extends HttpException {
  constructor(message?: string, statusCode?: number, code?: number) {
    super(
      {
        message: message || ExceptionTitleList.BadRequest,
        statusCode: statusCode || HttpStatus.BAD_REQUEST,
        error: true,
      },
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}

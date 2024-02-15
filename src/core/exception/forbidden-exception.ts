import {HttpException, HttpStatus} from '@nestjs/common';

export class ForbiddenException extends HttpException{
    constructor(message?: string, code?:number){
        super({
            message: message || 'Not Found',
            code: code || 404
        },
        HttpStatus.NOT_FOUND
        );
    }
}
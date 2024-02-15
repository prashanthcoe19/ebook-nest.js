import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TokenExpiredError } from 'jsonwebtoken';
import { ForbiddenException } from "../exception/forbidden-exception";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-strategy') {
    canActivate(context: ExecutionContext){
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (info instanceof TokenExpiredError) {
            throw new ForbiddenException('tokenExpired', 403);
        }
        if(err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../../modules/users/user.entity';
import { UsersService } from '../../modules/users/users.service';
// import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
// import { UnauthorizedException } from 'src/exception/unauthorized.exception';

const cookieExtractor = (req) => {
  return req?.cookies?.Authentication;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWTKEY
    });
  }

  /**
   * Validate if user exists and return user entity
   * @param payload
   */
  async validate(payload): Promise<User> {
    const { email } = payload;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user['dataValues'];
  }
}
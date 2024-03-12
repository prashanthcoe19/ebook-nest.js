import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from '../../core/strategy/jwt.strategy';
import { userProviders } from './auth.providers';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWTKEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UsersModule,
    MailModule,
  ],
  providers: [AuthService, JwtStrategy, JwtModule, ...userProviders],
  controllers: [AuthController],
})
export class AuthModule {}

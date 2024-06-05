import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from 'config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from '../../core/strategy/jwt.strategy';
import { userProviders } from './auth.providers';
import {
  loginThrottleProvider,
  resetPasswordThrottleProvider,
} from './throttle.providers';
import { MailModule } from '../mail/mail.module';
import { RateLimiterService } from './rate-limiter.service';
// import { Redis } from 'ioredis';
// import { RateLimiterRedis } from 'rate-limiter-flexible';
// console.log(parseInt(process.env.REDIS_PORT));
// const LoginThrottle = {
//   provide: 'LOGIN_THROTTLE',
//   useFactory: () => {
//     const redisClient = new Redis({
//       enableOfflineQueue: false,
//       host: process.env.REDIS_HOST,
//       port: 6379 || parseInt(process.env.REDIS_PORT),
//     });
//     console.log(redisClient);
//     return new RateLimiterRedis({
//       storeClient: redisClient,
//       keyPrefix: 'login-fail-throttle',
//       points: 10,
//       duration: 60000,
//       blockDuration: 3000,
//     });
//   },
// };
const jwtConfig = config.get('jwt');

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWTKEY || jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.expiresIn,
        },
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UsersModule,
    MailModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtModule,
    RateLimiterService,
    loginThrottleProvider,
    resetPasswordThrottleProvider,
    ...userProviders,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

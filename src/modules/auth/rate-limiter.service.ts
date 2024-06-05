import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import config from 'config';
const throttleConfig = config.get('throttle.login');
const redisConfig = config.get('queue');
@Injectable()
export class RateLimiterService {
  createRateLimiter(keyPrefix: string) {
    const redisClient = new Redis('redis://127.0.0.1:6379');

    return new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix,
      points: throttleConfig.points,
      duration: throttleConfig.duration,
      blockDuration: throttleConfig.blockDuration,
    });
  }
}

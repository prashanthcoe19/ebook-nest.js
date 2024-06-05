import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

const throttleConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000,
      limit: 10,
    },
  ],
  storage: new ThrottlerStorageRedisService({
    host: process.env.REDIS_HOST,
    port: 6379 || parseInt(process.env.REDIS_PORT),
  }),
};

export default throttleConfig;

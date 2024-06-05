// throttle.providers.ts

import { Provider } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';

export const loginThrottleProvider: Provider = {
  provide: 'LOGIN_THROTTLE',
  useFactory: (rateLimiterService: RateLimiterService) => {
    return rateLimiterService.createRateLimiter('login-fail-throttle');
  },
  inject: [RateLimiterService],
};

export const resetPasswordThrottleProvider: Provider = {
  provide: 'FORGOT_PASSWORD_THROTTLE',
  useFactory: (rateLimiterService: RateLimiterService) => {
    return rateLimiterService.createRateLimiter('forgot-password-throttle');
  },
  inject: [RateLimiterService],
};

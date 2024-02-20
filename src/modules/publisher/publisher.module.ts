import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { publisherProvider } from './publisher.provider';

@Module({
  controllers: [PublisherController],
  providers: [PublisherService, ...publisherProvider],
})
export class PublisherModule {}

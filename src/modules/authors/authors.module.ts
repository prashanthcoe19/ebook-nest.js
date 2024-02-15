import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { authorProviders } from './authors.providers';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, ...authorProviders],
})
export class AuthorsModule {}

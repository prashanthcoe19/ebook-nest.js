import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { bookProviders } from './books.provider';
@Module({
  // imports: [SequelizeModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService, ...bookProviders],
})
export class BooksModule {}

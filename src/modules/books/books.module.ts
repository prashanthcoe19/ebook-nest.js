import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { bookProviders } from './books.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './entities/book.entity';

@Module({
  // imports: [SequelizeModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService, ...bookProviders],
})
export class BooksModule {}

import { Module } from '@nestjs/common';

import { databaseProviders } from './database.providers';
import { SequelizeModule } from '@nestjs/sequelize';
const dbConfig = require('../../database/config');
const sequelizeConfig = dbConfig['development'];
import { User } from '../../modules/users/user.entity';
import { Post } from '../../modules/posts/post.entity';
import { RefreshToken } from '../../modules/auth/refresh-token.entity';
import { Author } from '../../modules/authors/entities/author.entity';
import { Category } from '../../modules/category/entities/category.entity';
import { Publisher } from '../../modules/publisher/entities/publisher.entity';
import { Book } from '../../modules/books/entities/book.entity';
import { BookAuthor } from '../../modules/bookAuthor/entities/bookAuthor.entity';
import { BookCategory } from '../../modules/bookCategory/entities/bookCategory.entitiy';
@Module({
  imports: [
    SequelizeModule.forRoot({
      ...sequelizeConfig,
      models: [
        User,
        Post,
        RefreshToken,
        Author,
        Category,
        Publisher,
        Book,
        BookAuthor,
        BookCategory,
      ],
    }),
  ],
  providers: [databaseProviders],
  exports: [databaseProviders],
})
export class DatabaseModule {}

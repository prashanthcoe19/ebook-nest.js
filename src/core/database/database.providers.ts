import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
const dbConfig = require('../../database/config');
import { User } from '../../modules/users/user.entity';
import { Post } from '../../modules/posts/post.entity';
import { RefreshToken } from '../../modules/auth/refresh-token.entity';
import { Author } from '../../modules/authors/entities/author.entity';
import { Category } from '../../modules/category/entities/category.entity';
import { Publisher } from '../../modules/publisher/entities/publisher.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = dbConfig.development;
          break;
        case TEST:
          config = dbConfig.test;
          break;
        case PRODUCTION:
          config = dbConfig.production;
          break;
        default:
          config = dbConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Post, RefreshToken, Author, Category, Publisher]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

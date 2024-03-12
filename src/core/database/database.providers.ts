// sequelize.provider.ts
import { Sequelize } from 'sequelize';
// import { sequelize } from './sequelize.config';
const dbConfig = require('../../database/config');
const sequelize = dbConfig['development'];

export const databaseProviders = {
  provide: Sequelize,
  useValue: sequelize,
};

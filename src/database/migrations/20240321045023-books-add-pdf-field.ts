'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Book', 'file', {
      allowNull: true,
      type: DataTypes.STRING,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Book', 'file');
  },
};

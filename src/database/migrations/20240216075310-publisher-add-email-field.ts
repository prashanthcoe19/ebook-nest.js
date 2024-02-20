'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Publisher', 'email', {
      allowNull: true,
      type: DataTypes.STRING,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Publisher', 'email');
  },
};

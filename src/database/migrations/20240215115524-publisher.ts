'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Publisher', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      _id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      year_founded: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      website: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      contact: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Publisher');
  },
};

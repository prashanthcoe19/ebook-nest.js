import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

'use strict';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      expiresAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      isRevoked: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('RefreshTokens');
  }
};

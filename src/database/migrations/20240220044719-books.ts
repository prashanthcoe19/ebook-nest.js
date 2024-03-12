'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Book', {
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
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isbn: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      publication_date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      language: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
      number_of_pages: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      cover_image: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      filename: {
        type: DataTypes.STRING,
      },
      sales_count: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      slug: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      publisherId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Publisher',
          key: 'id',
        },
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
    await queryInterface.dropTable('Book');
  },
};

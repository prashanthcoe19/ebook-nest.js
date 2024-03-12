'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('BookAuthor', {
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
      book_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Book',
          key: 'id',
        },
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Author',
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
    await queryInterface.dropTable('BookAuthor');
  },
};

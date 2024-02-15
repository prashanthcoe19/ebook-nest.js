import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      _id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      token_expires: {
        type: DataTypes.DATE,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
      },
    });
    await queryInterface.addIndex('Users', ['email']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Users');
  },
};

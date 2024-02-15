import {
    Column,
    DataType,
    Default,
    Model,
    Table,
    Unique,
  } from 'sequelize-typescript';
  
@Table({
    tableName: 'Users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
})
export class User extends Model<User> {
    @Column({
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    })
    id: number;
  
    @Column({
      type: DataType.UUID,
      allowNull: false,
      defaultValue: DataType.UUIDV4,
    })
    _id: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    name: string;
  
    @Column({
      type: DataType.STRING,
      unique: true,
      allowNull: false,
    })
    email: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    password: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    phone: string;
  
    @Default(false)
    @Column({
      type: DataType.BOOLEAN,
      allowNull: true,
    })
    isVerified: boolean;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    token: string;
  
    @Column({
      type: DataType.DATE,
      allowNull: true,
    })
    token_expires: Date;
  
    @Column({
      type: DataType.ENUM('male', 'female', 'other'),
      allowNull: false,
    })
    gender: string;
  
    @Default(DataType.NOW)
    @Column({
      type: DataType.DATE,
      allowNull: false,
    })
    createdAt: Date;
  
    @Default(DataType.NOW)
    @Column({
      type: DataType.DATE,
      allowNull: false,
    })
    updatedAt: Date;
}
  
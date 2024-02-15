import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Category',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class Category extends Model<Category> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  _id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Default(DataType.NOW)
  @Column
  createdAt: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt: Date;
}

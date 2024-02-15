import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Author',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class Author extends Model<Author> {
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

  @Default(DataType.NOW)
  @Column
  createdAt: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt: Date;
}

import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { Book } from '../../books/entities/book.entity';
import { Category } from '../../category/entities/category.entity';

@Table({
  tableName: 'BookCategory',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class BookCategory extends Model<BookCategory> {
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

  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  book_id: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @Default(DataType.NOW)
  @Column
  createdAt: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt: Date;
}

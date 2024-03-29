import {
  Column,
  DataType,
  Default,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { Book } from '../../books/entities/book.entity';
import { BookCategory } from '../../bookCategory/entities/bookCategory.entitiy';
@Table({
  tableName: 'Category',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class Category extends Model<Category> {
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
    allowNull: false,
  })
  slug: string;

  @BelongsToMany(() => Book, {
    through: 'BookCategory',
    foreignKey: 'category_id',
    otherKey: 'book_id',
  })
  books: Book[];

  @Default(DataType.NOW)
  @Column
  createdAt: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt: Date;
}

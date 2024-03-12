import {
  Column,
  DataType,
  Default,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { Book } from '../../books/entities/book.entity';
import { BookAuthor } from '../../bookAuthor/entities/bookAuthor.entity';

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

  @BelongsToMany(() => Book, {
    through: 'BookAuthor',
    foreignKey: 'author_id',
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

import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { Book } from '../../books/entities/book.entity';
import { Author } from '../../authors/entities/author.entity';

@Table({
  tableName: 'BookAuthor',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class BookAuthor extends Model<BookAuthor> {
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

  @ForeignKey(() => Author)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  author_id: number;

  @Default(DataType.NOW)
  @Column
  createdAt: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt: Date;
}

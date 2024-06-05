import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
  BelongsToMany,
  Default,
} from 'sequelize-typescript';
import { Author } from '../../authors/entities/author.entity';
import { Category } from '../../category/entities/category.entity';
import { Publisher } from '../../publisher/entities/publisher.entity';
import { BookAuthor } from '../../bookAuthor/entities/bookAuthor.entity';
import { BookCategory } from '../../bookCategory/entities/bookCategory.entitiy';
import { BelongsToManyAddAssociationMixin, Options } from 'sequelize';

@Table({
  tableName: 'Book',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class Book extends Model<Book> {
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
    allowNull: false,
    type: DataType.STRING,
  })
  title: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  isbn: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING,
  })
  slug: string;

  @Column({
    allowNull: false,
    type: DataType.DATEONLY,
  })
  publication_date: Date;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  language: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  price: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  number_of_pages: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  file: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  cover_image: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  sales_count: number;

  @Default(DataType.NOW)
  @Column
  createdAt: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt: Date;

  @BelongsToMany(() => Author, {
    through: 'BookAuthor',
    foreignKey: 'book_id',
    otherKey: 'author_id',
  })
  authors: Author[];

  @BelongsToMany(() => Category, {
    through: 'BookCategory',
    foreignKey: 'book_id',
    otherKey: 'category_id',
  })
  categories: Category[];

  @ForeignKey(() => Publisher)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  publisherId: string;

  @BelongsTo(() => Publisher)
  publisher: Publisher;

  addCategories!: BelongsToManyAddAssociationMixin<Category[], Book>;

  addAuthors!: BelongsToManyAddAssociationMixin<Author[], Book>;
}

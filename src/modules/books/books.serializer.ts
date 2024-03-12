import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Author } from '../authors/entities/author.entity';
import { Category } from '../category/entities/category.entity';
import { Publisher } from '../publisher/entities/publisher.entity';

export class BookSerializer {
  @Exclude()
  id: number;

  @Expose()
  _id: string;

  @Expose()
  title: string;

  @Expose()
  isbn: string;

  @Expose()
  description: string;

  @Expose()
  slug: string;

  @Expose()
  publication_date: Date;

  @Expose()
  price: number;

  @Expose()
  number_of_pages: number;

  @Expose()
  cover_image: string;

  @Expose()
  language: string;

  // Phone is optional, so it's not exposed by default
  @Transform(({ value }) => (value !== 'null' ? value : ''))
  sales_count: number;

  @Expose()
  @Type(() => Author)
  authors: Author[];

  @Expose()
  @Type(() => Category)
  categories: Category[];

  @Expose()
  @Type(() => Publisher)
  publisher: Publisher;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

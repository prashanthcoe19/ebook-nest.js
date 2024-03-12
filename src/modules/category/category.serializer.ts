import { Exclude, Expose } from 'class-transformer';

export class CategorySerializer {
  @Exclude()
  id: string;

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

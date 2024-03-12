import { Exclude, Expose } from 'class-transformer';

export class AuthorSerializer {
  @Exclude()
  id: string;

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

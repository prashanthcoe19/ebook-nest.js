import { Exclude, Expose } from 'class-transformer';

export class PublisherSerializer {
  @Exclude()
  id: number;

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  email: string;

  @Expose()
  website: string;

  @Expose()
  contact: string;

  @Expose()
  year_founded: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

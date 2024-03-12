import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class UserSerializer {
  @Exclude()
  id: string;

  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  // Phone is optional, so it's not exposed by default
  @Transform(({ value }) => (value !== 'null' ? value : ''))
  phone: string;

  @Expose()
  isVerified: boolean;

  // Token and token_expires are sensitive information, excluded by default
  @Exclude({
    toClassOnly: true,
  })
  token: string;

  @Exclude({
    toClassOnly: true,
  })
  token_expires: Date;

  @Expose()
  gender: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

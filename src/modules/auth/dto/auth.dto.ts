import { IsNotEmpty, IsEmail } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;
}

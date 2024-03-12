import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
export class CreatePublisherDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly slug: string;

  @IsNotEmpty()
  readonly year_founded: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly contact: string;

  @IsOptional()
  @IsUrl()
  readonly website: string;
}

import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsDateString,
  IsNumberString,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly isbn: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly slug: string;

  @IsNotEmpty()
  @IsDateString()
  readonly publication_date: Date;

  @IsNotEmpty()
  @IsString()
  @IsNumberString()
  readonly price: number;

  @IsNotEmpty()
  readonly number_of_pages: number;

  @IsNotEmpty()
  @IsString()
  readonly language: string;

  cover_image: string;

  file: string;

  @ArrayNotEmpty()
  @ArrayUnique()
  readonly authorId: string[];

  @ArrayNotEmpty()
  @ArrayUnique()
  readonly categoryId: string[];

  @IsNotEmpty()
  readonly publisherId: string;
}

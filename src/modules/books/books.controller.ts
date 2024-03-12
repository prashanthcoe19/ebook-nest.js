import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerUploadHelper } from '../../core/helpers/multer-upload.helper';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { BookSerializer } from './books.serializer';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('cover_image', multerUploadHelper('public/books', 5000000)),
  )
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BookSerializer> {
    if (file) {
      createBookDto.cover_image = file.filename;
    }
    // console.log(createBookDto);
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(): Promise<BookSerializer[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookSerializer> {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('cover_image', multerUploadHelper('public/books', 5000000)),
  )
  update(
    @Param('id') id: string,
    @Body() createBookDto: CreateBookDto,
  ): Promise<BookSerializer> {
    console.log(id);
    return this.booksService.update(id, createBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}

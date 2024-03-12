import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { AuthorSerializer } from './authors.serializer';

@UseGuards(JwtAuthGuard)
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<AuthorSerializer> {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.update(id, createAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}

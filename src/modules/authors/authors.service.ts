import { Injectable, Inject } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './entities/author.entity';
import { CustomHttpException } from '../../core/exception/custom-excpetion';

@Injectable()
export class AuthorsService {
  constructor(
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: typeof Author,
  ) {}
  create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorRepository.create(createAuthorDto);
  }

  findAll(): Promise<Author[]> {
    return this.authorRepository.findAll();
  }

  async findOne(id: string): Promise<Author | null> {
    const author = await this.authorRepository.findOne({ where: { _id: id } });
    if (!author) {
      throw new CustomHttpException('Author Not Found', 404);
    }
    return author;
  }

  async update(id: string, createAuthorDto: CreateAuthorDto): Promise<any> {
    const [affectedRowsCount, [updatedAuthor]] =
      await this.authorRepository.update(createAuthorDto, {
        where: { _id: id },
        returning: true,
      });
    if (affectedRowsCount === 1 && updatedAuthor) {
      return updatedAuthor;
    }
    throw new CustomHttpException('Author Not Found', 404);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.authorRepository.destroy({ where: { _id: id } });
  }
}

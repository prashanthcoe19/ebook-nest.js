import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Category } from '../category/entities/category.entity';
import { Author } from '../authors/entities/author.entity';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BookSerializer } from './books.serializer';
import { Publisher } from '../publisher/entities/publisher.entity';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class BooksService {
  constructor(
    private readonly sequelize: Sequelize,
    @Inject('BOOK_REPOSITORY')
    private bookRepository: typeof Book,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookSerializer> {
    // const transaction = await this.sequelize.transaction();
    const transaction = await this.sequelize.transaction();
    try {
      const [categories, authors] = await Promise.all([
        Category.findAll({
          where: { id: { [Op.in]: createBookDto.categoryId } },
        }),
        Author.findAll({
          where: { id: { [Op.in]: createBookDto.authorId } },
        }),
      ]);

      this.checkEntitiesExists(
        categories,
        createBookDto.categoryId,
        'category',
      );

      this.checkEntitiesExists(authors, createBookDto.authorId, 'author');

      const book = await this.bookRepository.create(createBookDto, {
        transaction,
      });

      await this.addAllBookAssociation(book, categories, authors, transaction),
        await transaction.commit();
      return plainToClass(
        BookSerializer,
        instanceToPlain(book['dataValues'], {}),
      );
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      throw err;
    }
  }

  async findAll(): Promise<BookSerializer[]> {
    return this.bookRepository.findAll({
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['_id', 'name'],
        },
        {
          model: Author,
          through: { attributes: [] },
          attributes: ['_id', 'name'],
        },
        {
          model: Publisher,
          attributes: ['_id', 'name'],
        },
      ],
      attributes: { exclude: ['id'] },
    });
  }

  async findOne(id: string): Promise<BookSerializer> {
    console.log(id);
    const book = await this.bookRepository.findOne({
      where: { _id: id },
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['_id', 'name'],
        },
        {
          model: Author,
          through: { attributes: [] },
          attributes: ['_id', 'name'],
        },
        {
          model: Publisher,
          attributes: ['_id', 'name'],
        },
      ],
      attributes: { exclude: ['id'] },
    });

    if (!book) {
      throw new NotFoundException('Book Not Found');
    }
    return book;
  }

  async update(
    id: string,
    createBookDto: CreateBookDto,
  ): Promise<BookSerializer | null> {
    const book = await this.saveBook(createBookDto, id);

    return plainToClass(BookSerializer, instanceToPlain(book, {}));

    const transaction = await this.sequelize.transaction();
    try {
      const [categories, authors] = await Promise.all([
        Category.findAll({
          where: { _id: { [Op.in]: createBookDto.categoryId } },
        }),
        Author.findAll({
          where: { _id: { [Op.in]: createBookDto.authorId } },
        }),
      ]);

      this.checkEntitiesExists(
        categories,
        createBookDto.categoryId,
        'category',
      );

      this.checkEntitiesExists(authors, createBookDto.authorId, 'author');

      const book = await this.bookRepository.findOne({
        where: { id },
        transaction,
      });

      await Promise.all([
        this.removeAllBookAssociation(book, transaction),
        this.addAllBookAssociation(book, categories, authors, transaction),
      ]);

      await transaction.commit();
      return book;
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      throw err;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }

  async saveBook(createBookDto: CreateBookDto, id?: string) {
    const transaction = await this.sequelize.transaction();
    try {
      const [categories, authors] = await Promise.all([
        Category.findAll({
          where: { _id: { [Op.in]: createBookDto.categoryId } },
        }),
        Author.findAll({
          where: { _id: { [Op.in]: createBookDto.authorId } },
        }),
      ]);

      this.checkEntitiesExists(
        categories,
        createBookDto.categoryId,
        'category',
      );

      this.checkEntitiesExists(authors, createBookDto.authorId, 'author');

      let book: Book;
      if (id) {
        book = await this.bookRepository.findOne({
          where: { id },
          transaction,
        });

        if (!book) {
          throw new NotFoundException('Book Not Found');
        }
        // Update the book entity
        await book.update(createBookDto, { transaction });
      } else {
        // Create a new book entity
        book = await this.bookRepository.create(createBookDto, {
          transaction,
        });
      }
      await this.removeAllBookAssociation(book, transaction);
      await this.addAllBookAssociation(book, categories, authors, transaction),
        await transaction.commit();
      return book;
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      throw err;
    }
  }

  private async removeAllBookAssociation(
    book: Book,
    transaction: Transaction,
  ): Promise<void> {
    await Promise.all([
      book.$set('categories', [], { transaction }),
      book.$set('authors', [], { transaction }),
    ]);
  }

  private async addAllBookAssociation(
    book: Book,
    categories: Category[],
    authors: Author[],
    transaction: Transaction,
  ): Promise<void> {
    console.log('Hereee');
    console.log(book);
    await Promise.all([
      book.addCategories(categories, {
        through: { book_id: book.id },
        transaction,
      }),
      book.addAuthors(authors, { through: { book_id: book.id }, transaction }),
    ]);
  }

  private checkEntitiesExists(
    entities: (Category | Author)[],
    entityIds: string[],
    entityName: string,
  ) {
    if (entities.length !== entityIds.length) {
      throw new NotFoundException(`One or more ${entityName}s not found`);
    }
  }
}

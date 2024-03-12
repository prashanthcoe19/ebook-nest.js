import { Injectable, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CustomHttpException } from '../../core/exception/custom-excpetion';
import { CategorySerializer } from './category.serializer';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: typeof Category,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySerializer> {
    const category = await this.categoryRepository.create(createCategoryDto);
    return plainToClass(
      CategorySerializer,
      instanceToPlain(category['dataValues'], {}),
    );
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll({ attributes: { exclude: ['id'] } });
  }

  async findOne(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({
      where: { _id: id },
    });
    if (!category) {
      throw new CustomHttpException('Category Not Found', 404);
    }
    return category;
  }

  async update(
    id: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySerializer | null> {
    await this.findOne(id);

    const updatedData = await this.categoryRepository.update(
      createCategoryDto,
      {
        where: { _id: id },
        returning: true,
      },
    );

    const updatedCategory = updatedData?.[1]?.[0];

    return plainToClass(
      CategorySerializer,
      instanceToPlain(updatedCategory['dataValues'], {}),
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.categoryRepository.destroy({ where: { _id: id } });
  }
}

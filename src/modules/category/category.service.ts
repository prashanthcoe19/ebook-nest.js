import { Injectable, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CustomHttpException } from '../../core/exception/custom-excpetion';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: typeof Category,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
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
  ): Promise<Category | null> {
    await this.findOne(id);

    const updatedData = await this.categoryRepository.update(
      createCategoryDto,
      {
        where: { _id: id },
        returning: true,
      },
    );

    return updatedData?.[1]?.[0];
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.categoryRepository.destroy({ where: { _id: id } });
  }
}

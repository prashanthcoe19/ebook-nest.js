import { Module } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryProvider } from './cateogry.provider';

@Module({
  controllers: [CategoryController],
  providers: [CategoriesService, ...categoryProvider],
})
export class CategoryModule {}

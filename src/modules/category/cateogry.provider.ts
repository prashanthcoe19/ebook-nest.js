import { Category } from './entities/category.entity';
export const categoryProvider = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useValue: Category,
  },
];

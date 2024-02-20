import { Publisher } from './entities/publisher.entity';
export const publisherProvider = [
  {
    provide: 'PUBLISHER_REPOSITORY',
    useValue: Publisher,
  },
];

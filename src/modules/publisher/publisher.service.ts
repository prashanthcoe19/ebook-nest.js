import { Injectable, Inject } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { CustomHttpException } from '../../core/exception/custom-excpetion';

@Injectable()
export class PublisherService {
  constructor(
    @Inject('PUBLISHER_REPOSITORY')
    private publisherRepository: typeof Publisher,
  ) {}

  async create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return this.publisherRepository.create(createPublisherDto);
  }

  async findAll(): Promise<Publisher[]> {
    return this.publisherRepository.findAll();
  }

  async findOne(id: string): Promise<Publisher | null> {
    const publisher = await this.publisherRepository.findOne({
      where: { _id: id },
    });
    if (!publisher) {
      throw new CustomHttpException('Publisher Not Found', 404);
    }
    return publisher;
  }

  async update(
    id: string,
    createPublisherDto: CreatePublisherDto,
  ): Promise<Publisher | null> {
    await this.findOne(id);
    const { name, email, website, contact, year_founded } = createPublisherDto;

    const updateData = {
      name,
      email,
      website: website ?? null,
      contact: contact ?? null,
      year_founded,
    };

    const updatedData = await this.publisherRepository.update(updateData, {
      where: { _id: id },
      returning: true,
    });

    return updatedData?.[1]?.[0];
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.publisherRepository.destroy({ where: { _id: id } });
  }
}

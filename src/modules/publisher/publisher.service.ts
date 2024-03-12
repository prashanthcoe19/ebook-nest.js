import { Injectable, Inject } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { CustomHttpException } from '../../core/exception/custom-excpetion';
import { PublisherSerializer } from './publisher.serializer';
import { instanceToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class PublisherService {
  constructor(
    @Inject('PUBLISHER_REPOSITORY')
    private publisherRepository: typeof Publisher,
  ) {}

  async create(
    createPublisherDto: CreatePublisherDto,
  ): Promise<PublisherSerializer> {
    const publisher = await this.publisherRepository.create(createPublisherDto);
    return plainToClass(
      PublisherSerializer,
      instanceToPlain(publisher['dataValues'], {}),
    );
  }

  async findAll(): Promise<Publisher[]> {
    return this.publisherRepository.findAll({
      attributes: { exclude: ['id'] },
    });
  }

  async findOne(id: string): Promise<PublisherSerializer | null> {
    const publisher = await this.publisherRepository.findOne({
      where: { _id: id },
    });
    if (!publisher) {
      throw new CustomHttpException('Publisher Not Found', 404);
    }
    return plainToClass(
      PublisherSerializer,
      instanceToPlain(publisher['dataValues'], {}),
    );
  }

  async update(
    id: string,
    createPublisherDto: CreatePublisherDto,
  ): Promise<PublisherSerializer | null> {
    await this.findOne(id);
    const { name, email, website, contact, year_founded, slug } =
      createPublisherDto;

    const updateData = {
      name,
      email,
      website: website ?? null,
      contact: contact ?? null,
      year_founded,
      slug,
    };

    const updatedData = await this.publisherRepository.update(updateData, {
      where: { _id: id },
      returning: true,
    });

    return plainToClass(
      PublisherSerializer,
      instanceToPlain(updatedData?.[1]?.[0]['dataValues'], {}),
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.publisherRepository.destroy({ where: { _id: id } });
  }
}

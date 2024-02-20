import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { Publisher } from './entities/publisher.entity';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post()
  create(@Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return this.publisherService.create(createPublisherDto);
  }

  @Get()
  findAll(): Promise<Publisher[]> {
    return this.publisherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Publisher> {
    return this.publisherService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return this.publisherService.update(id, createPublisherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherService.remove(id);
  }
}

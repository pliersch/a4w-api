import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(Tag)
    private readonly repository: Repository<Tag>,
  ) {
  }

  async create(createTagDto: CreateTagDto) {
    return await this.repository.save(createTagDto);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return await this.repository.update(id, updateTagDto);
  }

  async remove(id: number) {
    return await this.repository.remove(await this.findOne(id));
  }
}

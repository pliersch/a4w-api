import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly repository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<CreateTagDto & Tag> {
    return await this.repository.save(createTagDto);
  }

  async findAll(): Promise<Tag[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Tag> {
    return await this.repository.findOneBy({id: id});
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<UpdateResult> {
    return await this.repository.update(id, updateTagDto);
  }

  async remove(id: string): Promise<Tag> {
    return await this.repository.remove(await this.findOne(id));
  }
}

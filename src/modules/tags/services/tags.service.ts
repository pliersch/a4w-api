import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(tag: Tag): Promise<Tag> {
    console.log('TagsService create: ', tag)
    return this.tagRepository.save(tag);
  }

  async findById(id: string): Promise<Tag> {
    return this.tagRepository.findOneBy({id: id});
  }

  async update(id: string, name: string): Promise<UpdateResult> {
    console.log('TagsService update: ', name)
    return this.tagRepository.update(id, {name: name});
  }

  async remove(id: string): Promise<Tag> {
    return this.tagRepository.remove(await this.findById(id));
  }

}

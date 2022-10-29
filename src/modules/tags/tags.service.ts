import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { TagCategory } from "@modules/tags/entities/category.entity";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagCategory)
    private readonly categoryRepository: Repository<TagCategory>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<CreateTagDto & Tag> {
    return await this.tagRepository.save(createTagDto);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async findOne(id: string): Promise<Tag> {
    return await this.tagRepository.findOneBy({id: id});
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<UpdateResult> {
    return await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: string): Promise<Tag> {
    return await this.tagRepository.remove(await this.findOne(id));
  }

  //////////////////////////////////////////////////////////
  //                   System
  //////////////////////////////////////////////////////////

  // TODO move all system generate stuff in a separate file

  async createDefault(): Promise<void> {
    this.findAll().then((tags) => {
      if (tags.length > 0) {
        return true;
      } else {
        return this._createDefaultCategoryWithTags();
      }
    })
  }

  async _createDefaultCategoryWithTags(): Promise<boolean> {
    const promises = [];
    const tag: Tag = new Tag();
    tag.name = 'Patrick';
    await this.tagRepository.save(tag)

    const category: TagCategory = new TagCategory();
    category.name = 'Personen'
    category.priority = 1;
    category.tags = [tag]
    await this.categoryRepository.save(category)

    // promises.push(await this.categoryRepository.save(category));
    // promises.push(await this.tagRepository.save(tag));
    return new Promise(function (resolve) {
      resolve(true);
    });
  }
}

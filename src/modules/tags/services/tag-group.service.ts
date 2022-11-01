import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagCategory } from "@modules/tags/entities/category.entity";
import { CreateTagGroupDto } from "@modules/tags/dto/create-tag-group.dto";
import { UpdateTagGroupDto } from "@modules/tags/dto/update-tag-group.dto";

@Injectable()
export class TagGroupService {
  constructor(
    @InjectRepository(TagCategory)
    private readonly categoryRepository: Repository<TagCategory>,
  ) {}

  async create(dto: CreateTagGroupDto): Promise<TagCategory> {
    console.log('TagsService create: ', dto)
    return await this.categoryRepository.save(dto);
  }

  async findAll(): Promise<TagCategory[]> {
    return await this.categoryRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  async findById(id: string): Promise<TagCategory> {
    return this.categoryRepository.findOneBy({id: id});
  }

  async findOne(id: string): Promise<TagCategory> {
    return await this.categoryRepository.findOneBy({id: id});
  }

  async update(id: string, updateTagDto: UpdateTagGroupDto): Promise<UpdateResult> {
    console.log('TagsService update: ', updateTagDto)
    return await this.categoryRepository.update(id, updateTagDto);
  }

  async remove(id: string): Promise<TagCategory> {
    return await this.categoryRepository.remove(await this.findOne(id));
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
    await this.categoryRepository.save(tag)

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

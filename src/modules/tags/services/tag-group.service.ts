import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
import { UpdateTagGroupDto } from "@modules/tags/dto/update-tag-group.dto";

@Injectable()
export class TagGroupService {
  constructor(
    @InjectRepository(TagGroup)
    private readonly groupRepository: Repository<TagGroup>,
  ) {}

  async create(group: TagGroup): Promise<TagGroup> {
    return await this.groupRepository.save(group);
  }

  async findAll(): Promise<TagGroup[]> {
    return await this.groupRepository.find({
      select: {
        id: true,
        name: true,
        priority: true,
        tags: {
          id: true,
          name: true
        }
      },
      relations: {
        tags: true,
      },
    });
  }

  async findById(id: string): Promise<TagGroup> {
    return this.groupRepository.findOneBy({id: id});
  }

  async findOne(id: string): Promise<TagGroup> {
    return await this.groupRepository.findOneBy({id: id});
  }

  async update(id: string, updateTagDto: UpdateTagGroupDto): Promise<UpdateResult> {
    return await this.groupRepository.update(id, updateTagDto);
  }

  async remove(id: string): Promise<TagGroup> {
    return await this.groupRepository.remove(await this.findOne(id));
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
        return this._createDefaultGroupWithTags();
      }
    })
  }

  async _createDefaultGroupWithTags(): Promise<boolean> {
    // const promises = [];
    const tag: Tag = new Tag();
    tag.name = 'Patrick';
    // await this.groupRepository.save(tag)

    const tagGroup: TagGroup = new TagGroup();
    tagGroup.name = 'Personen'
    tagGroup.priority = 1;
    tagGroup.tags = [tag]
    await this.groupRepository.save(tagGroup)

    // promises.push(await this.groupRepository.save(tagGroup));
    // promises.push(await this.tagRepository.save(tag));
    return new Promise(function (resolve) {
      resolve(true);
    });
  }
}

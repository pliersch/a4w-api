import { Body, Controller, Delete, Get, Param, Patch, Post, Sse } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { Tag } from './entities/tag.entity';
import { UpdateResult } from 'typeorm';
import { Observable, Subject } from "rxjs";
import { TagCategory } from "@modules/tags/entities/category.entity";
import { UpdateTagGroupDto } from "@modules/tags/dto/update-tag-group.dto";
import { TagGroupService } from "@modules/tags/services/tag-group.service";
import { CreateTagGroupDto } from "@modules/tags/dto/create-tag-group.dto";
import { UpdateTagGroupResultDto } from "@modules/tags/dto/update-tag-group-result.dto";

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService,
              private readonly groupService: TagGroupService) {}

  // server sent MUST BE UNDER CONSTRUCTOR. OTHERWISE, A TYPEORM ERROR WILL THROW

  private changes$: Subject<MessageEvent> = new Subject()

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.changes$.asObservable();
  }

  private sendEvent(project: MessageEvent) {
    this.changes$.next(project)
  }

  @Post()
  create(@Body() createTagDto: CreateTagGroupDto): Promise<TagCategory> {
    return this.groupService.create(createTagDto);
  }

  @Get()
  findAll(): Promise<TagCategory[]> {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag | undefined> {
    return this.tagsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTagGroupDto): Promise<UpdateTagGroupResultDto> {
    // console.log('TagsController dto: ', dto)
    let group: TagCategory;
    const updateResult: UpdateTagGroupResultDto = new UpdateTagGroupResultDto();

    await this.groupService.findById(id).then((res) => {
      group = res;
    });
    updateResult.id = group.id;
    // console.log('TagsController update: ', group)
    let promises = [];
    let tag: Tag

    if (dto.removedTagIds) {
      for (const id of dto.removedTagIds) {
        promises.push(this.tagsService.removeOne(id));
      }
    }

    await Promise.all(promises)
      .then((res) => {
        console.log('TagsController removed: ', res)
        updateResult.removedTagIds = dto.removedTagIds;
      })
      .catch((e) => {
        console.log('error: ', e);
      });

    promises = [];
    if (dto.addedNames) {
      for (const name of dto.addedNames) {
        tag = new Tag();
        tag.name = name;
        tag.category = group;
        promises.push(this.tagsService.create(tag));
      }
    }
    await Promise.all(promises)
      .then((res) => {
        console.log('TagsController 1: ',)
        updateResult.addedTags = res;
      })
      .catch((e) => {
        console.log('error: ', e);
      });

    setTimeout(() => this.sendEvent({data: {type: 'tags_changed'}} as MessageEvent), 1000);
    console.log('TagsController result: ', updateResult)
    return updateResult;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.removeOne(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Sse } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { Tag } from './entities/tag.entity';
import { Observable, Subject } from "rxjs";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
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

  @Get()
  findAll(): Promise<TagGroup[]> {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag | undefined> {
    return this.tagsService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateTagGroupDto): Promise<TagGroup> {
    // console.log('TagsController create: ', dto)
    const tags: Tag[] = [];
    if (dto.tagNames) {
      let tag: Tag;
      for (const name of dto.tagNames) {
        tag = new Tag();
        tag.name = name;
        tags.push(tag);
      }
    }
    const group: TagGroup = new TagGroup();
    group.tags = tags;
    group.name = dto.name;
    group.priority = dto.priority;

    // await this.groupService.create(dto).then( group => {
    //
    // })
    // this.tagsService.create(dto.entries)
    return this.groupService.create(group);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTagGroupDto): Promise<UpdateTagGroupResultDto> {
    // console.log('TagsController dto: ', dto)
    let group: TagGroup;
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
        tag.group = group;
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
    return updateResult;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<TagGroup> {
    return this.groupService.remove(id);
  }
}

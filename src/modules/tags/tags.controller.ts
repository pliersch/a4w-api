import { Body, Controller, Delete, Get, Param, Patch, Post, Sse } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { UpdateResult } from 'typeorm';
import { UpdateTagDto } from "./dto/update-tag.dto";
import { Observable, Subject } from "rxjs";

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // server sent MUST BE UNDER CONSTRUCTOR. OTHERWISE, A TYPEORM ERROR WILL THROW

  private changes$: Subject<MessageEvent> = new Subject()

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.changes$.asObservable();
  }

  private sendEvent(project: MessageEvent) {
    console.log('TagsController sendEvent: ',)
    this.changes$.next(project)
  }

  @Post()
  create(@Body() createTagDto: CreateTagDto): Promise<CreateTagDto & Tag> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Tag | undefined> {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update: UpdateTagDto): Promise<UpdateResult> {
    // todo priority
    const updateTagDto = {
      entries: update.entries
    }
    const result = this.tagsService.update(id, updateTagDto);
    setTimeout(() => this.sendEvent({data: {type: 'tags_changed'}} as MessageEvent), 1000);
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.remove(id);
  }
}

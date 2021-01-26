import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { UpdateResult } from 'typeorm';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

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
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto): Promise<UpdateResult> {
    const updateResultPromise: Promise<UpdateResult> = this.tagsService.update(id, updateTagDto);
    console.log('updateResultPromise', updateResultPromise);
    return updateResultPromise;
    // return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.remove(+id);
  }
}

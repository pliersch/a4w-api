import { Module } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
import { TagGroupService } from "@modules/tags/services/tag-group.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, TagGroup])
  ],
  controllers: [TagsController],
  exports: [TagGroupService],
  providers: [TagGroupService, TagsService]
})
export class TagsModule {}

import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagCategory } from "@modules/tags/entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, TagCategory])
  ],
  controllers: [TagsController],
  exports: [TagsService],
  providers: [TagsService]
})
export class TagsModule {}

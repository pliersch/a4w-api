import { BaseEntity } from "@common/entities/base.entity";
import { Photo } from "@modules/photos/entites/photo.entity";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Tag extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  name: string;

  @ManyToOne(() => TagGroup, (group) => group.tags, {onDelete: 'CASCADE'})
  group: TagGroup

  @ManyToMany(() => Photo, (photo: Photo) => photo.tags)
  photos: Photo[];
}

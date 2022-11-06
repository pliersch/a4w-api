import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";
import { Photo } from "@modules/photos/entites/photo.entity";

@Entity()
export class Tag extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  name: string;

  @ManyToOne(() => TagGroup, (group) => group.tags)
  group: TagGroup

  // @ManyToMany(() => Photo, (group) => group.tags)
  // photo: Photo
}

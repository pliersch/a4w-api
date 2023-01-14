import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { TagGroup } from "@modules/tags/entities/tag-group.entity";

@Entity()
export class Tag extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  name: string;

  @ManyToOne(() => TagGroup, (group) => group.tags, {onDelete: 'CASCADE'})
  group: TagGroup

}

import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { Tag } from "@modules/tags/entities/tag.entity";

@Entity()
export class Category extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  name: string;

  @OneToMany(() => Tag, (tag) => tag.category)
  tags: Tag[]

  @Column({type: 'integer', default: 1})
  priority: number;
}
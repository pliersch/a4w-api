import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { TagCategory } from "@modules/tags/entities/category.entity";

@Entity()
export class Tag extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  name: string;

  @ManyToOne(() => TagCategory, (category) => category.tags)
  category: TagCategory
}

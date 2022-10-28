import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { Category } from "@modules/tags/entities/category.entity";

@Entity()
export class Tag extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  name: string;

  @ManyToOne(() => Category, (category) => category.tags)
  category: Category
}

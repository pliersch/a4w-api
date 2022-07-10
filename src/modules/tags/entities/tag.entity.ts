import { Column, Entity } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";

@Entity()
export class Tag extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  tagName: string;

  @Column({type: 'varchar', array: true})
  entries: string[];
}

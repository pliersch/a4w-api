import { Column, Entity } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";

@Entity()
export class Photo extends BaseEntity {

  @Column()
  fileName: string;

  @Column()
  recordDate: string;

  @Column({type: 'varchar', nullable: true, array: true})
  tags: string[];
}

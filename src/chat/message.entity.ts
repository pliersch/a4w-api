import {Column, Entity, UpdateDateColumn} from 'typeorm';
import {BaseEntity} from "../common/entities/base.entity";

@Entity()
export class Message extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  userId: string;

  @Column({type: 'varchar', length: 300})
  text: string;

  @Column({type: 'varchar', length: 300, nullable: true})
  pictures: string[];

}

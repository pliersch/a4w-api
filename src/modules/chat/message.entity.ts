import { Column, Entity } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";

@Entity()
export class Message extends BaseEntity {

  // todo one-to-many
  // @Column({type: 'uuid', length: 40})
  // id: string;

  @Column({type: 'varchar', length: 300})
  text: string;

  @Column({type: 'varchar', length: 300, nullable: true})
  pictures: string[];

}

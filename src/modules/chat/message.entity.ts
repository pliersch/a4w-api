import { BaseTimeEntity } from "@common/entities/base.time.entity";
import { User } from "@modules/users/entities/user.entity";
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Message extends BaseTimeEntity {

  @Column({type: 'varchar', length: 300, nullable: true})
  text: string;

  @Column({type: 'varchar', length: 600, nullable: true, array: true})
  fileNames: string[];

  @ManyToOne(() => User, (user) => user.messages)
  user: User
}

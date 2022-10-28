import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { User } from "@modules/users/entities/user.entity";
import { Tag } from "@modules/tags/entities/tag.entity";

@Entity()
export class Photo extends BaseEntity {

  @Column()
  fileName: string;

  @Column({nullable: true, default: 0})
  rating: number;

  @Column()
  recordDate: string;

  @ManyToMany(() => Tag)
  tags: Tag[]

  @ManyToOne(() => User, (user) => user.photos)
  user: User
}

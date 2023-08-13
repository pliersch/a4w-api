import { BaseEntity } from "@common/entities/base.entity";
import { Tag } from "@modules/tags/entities/tag.entity";
import { User } from "@modules/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Photo extends BaseEntity {

  @Column()
  fileName: string;

  @Column({nullable: true, default: 0})
  rating: number;

  @Column({type: 'date'})
  recordDate: Date;

  @Column({default: false})
  isPrivate: boolean;

  @ManyToOne(() => User, (user) => user.photos)
  user: User

  @ManyToMany(() => Tag, (tag) => tag.photos, {
    onDelete: "CASCADE",
    cascade: ["insert", "remove", "soft-remove"],
  })
  @JoinTable()
  tags: Tag[] // todo return only the id
}

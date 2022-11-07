import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
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

  @Column({default: true})
  public: boolean;

  @ManyToMany(() => Tag, {
    cascade: [/*"insert",*/ "remove", "soft-remove"],
  })
  @JoinTable()
  tags: Tag[] // todo return only the id

  // @ManyToMany(() => User, (user) => user.protectedPhotos)
  // allowedUser: User[];

  // @Column({type: "uuid", nullable: true})
  // userId: string;

  @ManyToOne(() => User, (user) => user.photos)
    // @JoinColumn({name: "userId"})
  user: User
}

import { BaseEntity } from "@common/entities/base.entity";
import { Message } from "@modules/chat/message.entity";
import { Photo } from "@modules/photos/entites/photo.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

export enum Role {
  Guest,
  User,
  Admin
}

export enum Status {
  accept,
  wait,
  block,
}

@Entity()
export class User extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  surName: string;

  @Column({type: 'varchar', length: 40})
  givenName: string;

  @Column({type: 'varchar', length: 100})
  email: string;

  @Column({type: 'int'})
  role: Role;

  @Column({type: 'int'})
  status: Status;

  @Column({type: 'date', nullable: true})
  lastLogin: Date;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[]

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

  @ManyToMany(() => User)
  @JoinTable()
  allowedUser: User[];

  @ManyToMany(() => Photo, (photo) => photo.user, {
    cascade: ["remove", "soft-remove"],
  })
  @JoinTable()
  favorites: Photo[]

}

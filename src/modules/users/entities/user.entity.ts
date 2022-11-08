import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Photo } from "@modules/photos/entites/photo.entity";
import { BaseEntity } from "@common/entities/base.entity";

export enum Role {
  Admin,
  User,
  Guest
}

export enum Status {
  accept,
  wait,
  block,
}

@Entity()
export class User extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  lastName: string;

  @Column({type: 'varchar', length: 40})
  givenName: string;

  @Column({type: 'varchar', length: 100})
  email: string;

  @Column({type: 'int', nullable: true})
  role: Role;

  @Column({type: 'int', nullable: true})
  status: Status;

  @Column({type: 'date'})
  lastLoginAt: Date;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[]

  @ManyToMany(() => User)
  @JoinTable()
  allowedUser: User[];

  @ManyToMany(() => Photo, (photo) => photo.user)
  favorites: Photo[]

  // todo message createdBy is a string at the moment
  // @OneToMany(() => Message, (message) => message.)
  // messages: Message[]
}

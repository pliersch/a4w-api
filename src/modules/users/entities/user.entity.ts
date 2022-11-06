import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { ExtendedBaseEntity } from "@common/entities/extended-base.entity";
import { Photo } from "@modules/photos/entites/photo.entity";

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
export class User extends ExtendedBaseEntity {

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

  @ManyToMany(() => Photo, (photo) => photo.user)
  favorites: Photo[]

  @OneToMany(() => Photo, (photo) => photo.allowedUser)
  protectedPhotos: Photo[]

  // todo message createdBy is a string at the moment
  // @OneToMany(() => Message, (message) => message.)
  // messages: Message[]
}

import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";
import { ExtendedBaseEntity } from "@common/entities/extended-base.entity";

export enum Role {
  Admin,
  User,
  Guest
}

export enum Status {
  wait,
  block,
  accept,
}

@Entity()
export class User extends ExtendedBaseEntity {

  @Column({type: 'varchar', length: 40})
  lastName: string;

  @Column({type: 'varchar', length: 40})
  givenName: string;

  @Column({type: 'varchar', length: 100})
  email: string;

  @Column('int')
  role: Role;

  @Column('int')
  status: Status;

  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  lastLoginDate: Date;
}

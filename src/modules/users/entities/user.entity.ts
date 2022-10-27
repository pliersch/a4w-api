import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { ExtendedBaseEntity } from "@common/entities/extended-base.entity";

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

  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  lastLoginDate: Date;
}

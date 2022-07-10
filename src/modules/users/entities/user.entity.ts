import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";

@Entity()
export class User extends BaseEntity {

  @Column({type: 'varchar', length: 40})
  lastName: string;

  @Column({type: 'varchar', length: 40})
  givenName: string;

  @Column({type: 'varchar', length: 20})
  title: string;

  @Column({type: 'varchar', length: 100})
  email: string;

  @Column({type: 'varchar', length: 30})
  role: string;

  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  lastLoginDate: Date;
}

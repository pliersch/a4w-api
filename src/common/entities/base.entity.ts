import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createDateTime: Date;

  // TODO remove nullable if admin in table ;)
  @Column({type: 'varchar', length: 300, nullable: true})
  createdBy: string; // todo replace by user-ref

  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  lastChangedDateTime: Date;

  // TODO remove nullable
  @Column({type: 'varchar', length: 300, nullable: true})
  lastChangedBy: string; // todo replace by user-ref
}

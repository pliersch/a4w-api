import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  // TODO remove nullable if admin in table ;)
  @Column({type: 'uuid', nullable: true})
  createdBy: string;

  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  lastChangedAt: Date;

  // TODO remove nullable
  @Column({type: 'uuid', nullable: true})
  lastChangedBy: string;
}

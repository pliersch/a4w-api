import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  // TODO remove nullable
  @Column({ type: 'varchar', length: 300, nullable: true })
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  // TODO remove nullable
  @Column({ type: 'varchar', length: 300, nullable: true })
  lastChangedBy: string;

  // @Column({ type: 'varchar', length: 300, nullable: true })
  // internalComment: string | null;

  // @Column({ type: 'boolean', default: true })
  // isActive: boolean;

  // @Column({ type: 'boolean', default: false })
  // isArchived: boolean;
}

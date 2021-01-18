import { BaseEntity } from '../../core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Tag extends BaseEntity {

  @Column({ type: 'varchar', length: 40 })
  tagName: string;

  @Column({ type: 'varchar', array: true })
  entries: string[];
}

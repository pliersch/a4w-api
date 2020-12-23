import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity()
export class Photo extends BaseEntity {

  @Column()
  fileName: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  tags: string[];
}

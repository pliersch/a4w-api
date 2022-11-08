import { Column } from 'typeorm';
import { BaseEntity } from "@common/entities/base.entity";

export abstract class ExtendedBaseEntity extends BaseEntity {

  @Column({type: 'varchar', length: 300, nullable: true})
  internalComment: string | null;

  @Column({type: 'boolean', default: true})
  isActive: boolean;

}

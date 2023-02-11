import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseTimeEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

}

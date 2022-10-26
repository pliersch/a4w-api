import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {

  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'ALWAYS'
  })
  id: string;

  @Column({type: 'varchar', length: 40})
  tagName: string;

  @Column({type: 'integer', default: 1})
  priority: number;
}

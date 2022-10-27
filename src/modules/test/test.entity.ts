import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {

  @PrimaryGeneratedColumn('identity', {
    generatedIdentity: 'ALWAYS'
  })
  id: string;

  @Column({type: 'varchar', length: 40, nullable: true})
  tagName: string;

  @Column({type: 'date', nullable: true})
  begin: string;
}

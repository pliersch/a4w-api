import { BaseTimeEntity } from "@common/entities/base.time.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Visit extends BaseTimeEntity {

  @Column()
  email: string;
}

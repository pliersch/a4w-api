import { CreateVisitDto } from "@modules/admin/visits/dto/create-visit.dto";
import { Visit } from "@modules/admin/visits/entities/visit.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class VisitsService {

  constructor(
    @InjectRepository(Visit)
    private readonly repository: Repository<Visit>,
  ) {
  }

  async create(dto: CreateVisitDto): Promise<Visit> {
    return await this.repository.save(dto);
  }

  findAll(): Promise<Visit[]> {
    return this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  deleteAll() {
    return this.repository.delete({});
  }
}

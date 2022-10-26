import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from "@modules/test/test.entity";

@Injectable()
export class TestService {

  constructor(
    @InjectRepository(Test)
    private readonly repository: Repository<Test>,
  ) {
  }

  async create(Test: Test): Promise<Test> {
    return await this.repository.save(Test);
  }

  async findAll(): Promise<Test[]> {
    return await this.repository.find();
  }

}

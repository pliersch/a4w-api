import { Controller, Get, Post } from '@nestjs/common';
import { DeleteResult } from "typeorm";
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  // will create inside UserController when user login
  // @Post()
  // create(@Body() dto: CreateVisitDto) {
  //   return this.visitsService.create(dto);
  // }

  @Get()
  findAll() {
    return this.visitsService.findAll();
  }

  @Post('delete-all')
  async deleteAll(): Promise<DeleteResult> {
    return this.visitsService.deleteAll();
  }
}

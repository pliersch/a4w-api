import { Body, Controller, Get, Post } from '@nestjs/common';
import { Test } from "@modules/test/test.entity";
import { TestService } from "@modules/test/test.service";

@Controller('test')
export class TestController {

  constructor(private readonly testService: TestService) {
  }

  @Post()
  create(@Body() user: Test) {
    return this.testService.create(user);
  }

  @Get()
  findAll() {
    return this.testService.findAll();
  }

}


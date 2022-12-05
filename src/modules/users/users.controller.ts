import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, Status, User } from './entities/user.entity';

@Controller('user')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Post('login')
  async login(@Body() user: User) {
    let result: User = null;
    await this.usersService.login(user).then((u) => {
      if (u) {
        result = u;
      }
    })
    if (result.status === Status.block) {
      return null;
    }
    if (!result) {
      await this.createGuest(user).then((u) => {
        result = u;
      })
    }
    console.log('UsersController login: ', result)
    return result;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(/*id,*/ user);
  }

  private createGuest(user: User) {
    user.status = Status.wait;
    user.role = Role.Guest;
    return this.usersService.create(user);
  }
}


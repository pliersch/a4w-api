import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('auth')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Post('login')
  login(@Body() user: User) {
    console.log('UsersController login: ', user)
    // return this.usersService.login(user);
    let promise = this.usersService.login(user);
    promise.then((user) => {
      console.log(user);
      if (!user) {
        promise = this.createGuest(user);
      }
    })
    return promise;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(/*id,*/ user);
  }

  private createGuest(userDto: User) {
    return this.usersService.create(userDto);
  }
}


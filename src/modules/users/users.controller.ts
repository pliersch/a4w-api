import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role, Status, User } from './entities/user.entity';
import { CreateUserDto } from "@modules/users/dto/create-user.dto";

@Controller('auth')
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Post('login')
  login(@Body() userDto: CreateUserDto) {
    console.log('UsersController login: ', userDto)
    let promise = this.usersService.login(userDto);
    promise.then((user) => {
      console.log(user);
      if (!user) {
        promise = this.createGuest(userDto);
      }
    })
    console.log('UsersController login: ', promise)
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

  private createGuest(userDto: CreateUserDto) {
    const user: User = {
      lastName: userDto.lastName,
      givenName: userDto.firstName,
      email: userDto.email,
      role: Role.Guest,
      status: Status.wait,

    }
    return this.usersService.create(user);
  }
}


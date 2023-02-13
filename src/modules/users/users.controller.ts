import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role, Status, User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() user: User) {
    console.log('UsersController create: ', user)
    return this.usersService.create(user);
  }

  @Post('signin')
  async signin(@Body() user: User) {
    let result: User = null;
    await this.usersService.signin(user).then((u) => {
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
    return result;
  }

  @Post('login')
  async login(@Body() {id}: any) {
    return this.usersService.findById(id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  private createGuest(user: User) {
    user.status = Status.wait;
    user.role = Role.Guest;
    return this.usersService.create(user);
  }
}

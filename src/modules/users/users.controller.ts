import { Visit } from "@modules/admin/visits/entities/visit.entity";
import { EmailLogin } from "@modules/users/dto/user.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { getPostgresDataSource } from "../../postgres.datasource";
import { Status, User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Post('signin')
  async loginWithGoogle(@Body() u: User) {
    const user = await this.usersService.findOne({email: u.email});
    if (user.status === Status.block) {
      return null;
    }
    return this.protocolLogin(user);
  }

  // this is a temporary solution/hack for presentation
  @Post('login')
  async loginWithEmail(@Body() data: EmailLogin) {
    if (data.password !== '..,-fidM') {
      return null;
    }
    const user = await this.usersService.findOne({email: data.email});
    return this.protocolLogin(user);

  }

  @Post('login-id')
  async loginWithId(@Body() {id}: any) {
    const user: User = await this.usersService.findOne({id: id});
    return this.protocolLogin(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findOne({id: id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  private async protocolLogin(user: User): Promise<User> {
    user.lastLogin = new Date();
    await this.usersService.update(user.id, user);
    const dataSource = await getPostgresDataSource();
    const visitRepository = dataSource.manager.getRepository(Visit);
    await visitRepository.save({email: user.email})
    return user;
  }

  // private createGuest(user: User) {
  //   user.status = Status.wait;
  //   user.role = Role.Guest;
  //   return this.usersService.create(user);
  // }
}

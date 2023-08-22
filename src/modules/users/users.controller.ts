import { Visit } from "@modules/admin/visits/entities/visit.entity";
import { EmailLogin } from "@modules/users/dto/user.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, Sse } from '@nestjs/common';
import { Observable, Subject } from "rxjs";
import { getPostgresDataSource } from "../../postgres.datasource";
import { Status, User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  // server sent MUST BE UNDER CONSTRUCTOR. OTHERWISE, A TYPEORM ERROR WILL THROW
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.changes$.asObservable();
  }

  private changes$: Subject<MessageEvent> = new Subject()

  private sendEvent(event: MessageEvent) {
    this.changes$.next(event)
  }

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
    const login = new Date();
    user.lastLogin = login;
    await this.usersService.update(user.id, user);
    const dataSource = await getPostgresDataSource();
    const visitRepository = dataSource.manager.getRepository(Visit);
    await visitRepository.save({email: user.email});
    const payload = {
      userId: user.id,
      email: user.email,
      created: login
    }
    const event = {
      data: {
        type: 'visit_added',
        payload: payload
      }
    };
    setTimeout(() => this.sendEvent(event as MessageEvent), 300);
    return user;
  }

  // private createGuest(user: User) {
  //   user.status = Status.wait;
  //   user.role = Role.Guest;
  //   return this.usersService.create(user);
  // }
}

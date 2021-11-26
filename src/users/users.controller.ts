import {Body, Controller, Get, Logger, Param, Post, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from './entities/user.entity';

@Controller('users')
export class UsersController {

    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    create(@Body() user: User) {
        return this.usersService.create(user);
    }

    @Post('login')
    login(@Body() user: User) {
        return this.usersService.login(user);
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
}

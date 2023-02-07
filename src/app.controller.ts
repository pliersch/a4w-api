import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from "@modules/users/users.service";
import { TagGroupService } from "@modules/tags/services/tag-group.service";

@Controller()
export class AppController {

  constructor(private readonly appService: AppService,
              private readonly tagsService: TagGroupService,
              private readonly usersService: UsersService,
  ) {
    this.init();
    // console.log('env: ', process.env.NODE_ENV)
  }

  @Get()
  getNestMessage(): string {
    return this.appService.getNestMessage();
  }

  private init() {
    const userPromise = this.usersService.createSystemUser();
    const tagsPromise = this.tagsService.createDefault();
    //
    // this.tagsService.findAll().then((all) => console.log('tags: ' + all.length));
    //
    // Promise.all([userPromise, tagsPromise]).then((values) => {
    //   console.log(values);
    // });
  }
}

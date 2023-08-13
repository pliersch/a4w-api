import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role, Status, User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) { }

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findOne(option: FindOptionsWhere<User>): Promise<User> {
    return this.repository.findOneBy(option);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async update(id: string, user: User) {
    return this.repository.update(id, user);
  }

  async remove(id: string) {
    const user = await this.repository.findOneBy({id: id});
    return this.repository.remove(user);
  }

  // async removeMany(users: User[]) {
  //   return await this.repository.remove(users);
  // }

  //////////////////////////////////////////////////////////
  //                   System
  //////////////////////////////////////////////////////////

  async createSystemUser(): Promise<User> {
    let result: User = null;
    await this.repository.findOneBy({email: 'hourby@gmail.com'}).then((user) => {
      if (user) {
        result = user;
      }
    });
    if (!result) {
      await this.repository.save(this._getSystemUser()).then((user => result = user));
    }
    return result;
  }

  _getSystemUser(): Partial<User> {
    return {
      givenName: 'Patrick',
      surName: 'Liersch',
      email: 'hourby@gmail.com',
      status: Status.accept,
      role: Role.Admin,
      lastLogin: new Date()
    }
  }
}

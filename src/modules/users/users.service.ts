import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Status, User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) { }

  async login(user: User): Promise<User | undefined> {
    const res = this.repository.findOneBy({email: user.email});
    await res.then(val => {
      val.lastLogin = new Date();
      this.repository.save(val);
    })
    return res;
  }

  async create(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOneBy({id: id});
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
      lastName: 'Liersch',
      email: 'hourby@gmail.com',
      status: Status.accept,
      role: Role.Admin,
      lastLogin: new Date()
    }
  }
}

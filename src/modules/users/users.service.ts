import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from "@modules/users/dto/create-user.dto";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
  }

  async login(user: CreateUserDto): Promise<User | undefined> {
    return await this.repository.findOne(findUserByAuthTokenOptions(user));
  }

  async create(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.repository.findOneBy({id: id});
  }

  async update(user: User) {
    return await this.repository.update(user.id, user);
  }

  async removeOne(id: string) {
    return await this.repository.remove(await this.repository.findOneBy({id: id}));
  }

  // async removeMany(users: User[]) {
  //   return await this.repository.remove(users);
  // }
}

function findUserByAuthTokenOptions(user: CreateUserDto) {
  // console.log('func obj', user.id);
  return {
    where:
      {email: user.email}
  };
}

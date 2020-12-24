import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async login(user: User): Promise<User | undefined> {
    return await this.userRepository.findOne(findUserByAuthTokenOptions(user));
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async update(user: User) {
    return await this.userRepository.update(user.id, user);
  }

  async removeOne(id: string) {
    const user = await this.userRepository.findOne(id);
    return await this.userRepository.remove(user);
  }

  // async removeMany(users: User[]) {
  //   return await this.userRepository.remove(users);
  // }
}

function findUserByAuthTokenOptions(user: User) {
  console.log('func obj', user.id);
  return {
    where:
      { lastName: user.lastName }
  };
}

import { Injectable } from '@nestjs/common';
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

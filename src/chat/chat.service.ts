import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Message } from './message.entity';


@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {
  }

  async create(message: Message): Promise<Message> {
    return await this.repository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Message> {
    return await this.repository.findOne(id);
  }

  async update(message: Message) {
    return await this.repository.update(message.id, message);
  }

  async removeOne(id: string) {
    const message = await this.repository.findOne(id);
    return await this.repository.remove(message);
  }
}

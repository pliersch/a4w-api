import { QueryMessagesDto } from "@modules/chat/chat.model";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Message } from './message.entity';


@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>,
  ) {
  }

  async create(message: Message): Promise<Message> {
    return this.repository.save(message);
  }

  async findAll(dto: QueryMessagesDto): Promise<Message[]> {
    return this.repository.find({
      select: {
        user: {
          id: true,
          surName: true,
          givenName: true
        }
      },
      relations: {
        user: true
      },
      order: {
        created: 'ASC'
      },
      skip: dto.from,
      take: dto.take
    });
  }

  async findOne(id: string): Promise<Message> {
    return this.repository.findOne({
      where: {
        id: id
      },
      select: {
        user: {
          id: true,
          surName: true,
          givenName: true
        }
      },
      relations: {
        user: true
      },
      order: {
        created: 'ASC'
      }
    });
  }

  async update(message: Message): Promise<UpdateResult> {
    return this.repository.update(message.id, message);
  }

  async removeOne(id: string): Promise<Message> {
    const message = await this.repository.findOneBy({id: id});
    return this.repository.remove(message);
  }

  deleteAll(): Promise<DeleteResult> {
    return this.repository.delete({});
  }

}

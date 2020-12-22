import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entites/photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {
  }

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  findOne(id: string): Promise<Photo> {
    return this.photoRepository.findOne(id);
  }

}

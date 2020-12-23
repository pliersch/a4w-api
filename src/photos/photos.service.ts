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

  async create(photo: Photo): Promise<Photo> {
    return await this.photoRepository.save(photo);
  }

  async findAll(): Promise<Photo[]> {
    return await this.photoRepository.find();
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoRepository.findOne(id);
  }

  async update(photo: Photo) {
    return await this.photoRepository.update(photo.id, photo);
  }

  async removeOne(id: string) {
    const photo = await this.photoRepository.findOne(id);
    return await this.photoRepository.remove(photo);
  }

  // async removeMany(photos: Photo[]) {
  //   return await this.photoRepository.remove(photos);
  // }
}

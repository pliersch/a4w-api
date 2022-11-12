import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entites/photo.entity';
import { UpdatePhotoDto } from "./dto/update-photo.dto";
import { PhotoMetaDataDto } from "./dto/photo-meta-data-result.dto";
import { PhotosResultDto } from "./dto/photos-result.dto";
import { PhotosRequestDto } from "./dto/photos.request.dto";

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

  async getMetaData(): Promise<PhotoMetaDataDto> {
    return new PhotoMetaDataDto(await this.photoRepository.count());
  }

  async getPhotos(pageOptionsDto: PhotosRequestDto): Promise<PhotosResultDto> {
    const queryBuilder = this.photoRepository.createQueryBuilder('photos');
    queryBuilder
      .orderBy('photos.recordDate', pageOptionsDto.order)
      .leftJoinAndSelect("photos.tags", "tags")
      .skip(pageOptionsDto.from)
      .take(pageOptionsDto.take);

    const {entities} = await queryBuilder.getRawAndEntities();
    const count = await this.photoRepository.count();
    return {photos: entities, availablePhotos: count};
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoRepository.findOneBy({id: id});
  }

  async replace(photo: Photo) {
    return await this.photoRepository.update(photo.id, photo);
  }

  async update(id: string, dto: UpdatePhotoDto) {
    return await this.photoRepository.update(id, dto);
  }

  async removeOne(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findOneBy({id: id});
    // photo.tags = [];
    // this.photoRepository.save(photo);
    return await this.photoRepository.remove(photo);
  }

  // async deleteMany(ids: string[]): Promise<DeleteResult> {
  //   return this.photoRepository.delete(ids);
  // }
}

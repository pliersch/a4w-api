import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entites/photo.entity';
import { UpdatePhotoDto } from "./dto/update-photo.dto";
import { DeletePhotoResultDto } from "./dto/delete-photo-result.dto";
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
    const number = await this.photoRepository.count();
    return new PhotoMetaDataDto(number)
  }

  async getPhotos(pageOptionsDto: PhotosRequestDto): Promise<PhotosResultDto> {
    console.log('PhotosService getPhotos: ', pageOptionsDto)
    const queryBuilder = this.photoRepository.createQueryBuilder('photos');
    queryBuilder
      .orderBy('photos.createDateTime', pageOptionsDto.order)
      .skip(pageOptionsDto.from)
      .take(pageOptionsDto.take);

    const {entities} = await queryBuilder.getRawAndEntities();
    const count = await this.photoRepository.count();
    return {photos: entities, availablePhotos: count};
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoRepository.findOne(id);
  }

  async replace(photo: Photo) {
    return await this.photoRepository.update(photo.id, photo);
  }

  async update(id: string, dto: UpdatePhotoDto) {
    return await this.photoRepository.update(id, dto);
  }

  async removeOne(id: string): Promise<DeletePhotoResultDto> {
    // const photo = await this.photoRepository.findOne(id);
    // const deleteResult = await this.photoRepository.remove(photo);
    const deleteResult: DeleteResult = await this.photoRepository.delete(id);
    console.log('PhotosService removeOne: ', deleteResult)
    const res: string = deleteResult.affected == 1 ? id : null;
    return new Promise(function (resolve) {
      resolve({id: res});
    });

  }
}

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entites/photo.entity';
import { UpdatePhotoDto } from "./dto/update-photo.dto";
import { DeletePhotoResultDto } from "./dto/delete-photo-result.dto";
import { PageOptionsDto } from "../common/dtos/page-options.dto";
import { PageDto } from "../common/dtos/page.dto";
import { PageMetaDto } from "../common/dtos/page-meta.dto";

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

  async getPhotos(pageOptionsDto: PageOptionsDto): Promise<PageDto<Photo>> {
    console.log('PhotosService getPhotos: ', pageOptionsDto)
    const queryBuilder = this.photoRepository.createQueryBuilder('photos');

    queryBuilder
      .orderBy('photos.createDateTime', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const {entities} = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({itemCount, pageOptionsDto});

    console.log('PhotosService getPhotos: ', entities, pageMetaDto)

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoRepository.findOne(id);
  }

  async replace(photo: Photo) {
    return await this.photoRepository.update(photo.id, photo);
  }

  async update(id: string, dto: UpdatePhotoDto) {
    console.log(id, dto)
    return await this.photoRepository.update(id, dto);
  }

  async removeOne(id: string): Promise<DeletePhotoResultDto> {
    const photo = await this.photoRepository.findOne(id);
    const photo1 = await this.photoRepository.remove(photo);
    const res: string = photo1 ? id : null;
    console.log('PhotosService removeOne: ', res)
    return new Promise(function (resolve) {
      resolve({id: res});
    });

  }

  // async removeMany(photos: Photo[]) {
  //   return await this.photoRepository.remove(photos);
  // }
}

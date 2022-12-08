import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entites/photo.entity';
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

    const photos = await this.photoRepository.find({
      select: {
        id: true,
        rating: true,
        created: true,
        recordDate: true,
        isPrivate: true,
        fileName: true,
        tags: {
          id: true,
          name: true,
          //group
        }
      }, relations: {
        tags: true
      }, order: {
        recordDate: "ASC",
      },
      skip: pageOptionsDto.from,
      take: pageOptionsDto.take
    });
    const count = await this.photoRepository.count();
    return {photos: photos, availablePhotos: count};
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoRepository.findOneBy({id: id});
  }

  /**
   * @param id
   * will use to update tags
   */
  async findOneWithTags(id: string): Promise<Photo> {
    return await this.photoRepository.findOne({
      where: {
        id: id
      },
      select: {
        id: true,
        tags: {
          id: true,
          name: true
        }
      },
      relations: {
        tags: true
      }
    });
  }

  async replace(photo: Photo) {
    return await this.photoRepository.update(photo.id, {tags: photo.tags});
  }

  async update(id: string, photo: Partial<Photo>) {
    // todo calling 'update' throws error
    return await this.photoRepository.save(photo);
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

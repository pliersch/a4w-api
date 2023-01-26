import { getFindPhotosWithTagsOptions, getFindPhotoWithTagsOptions } from "@modules/photos/find-options";
import { Tag } from "@modules/tags/entities/tag.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { getPostgresDataSource } from "../../postgres.datasource";
import {
  PhotoCountByTag,
  PhotoCountByTagImpl,
  PhotoMetaDataDto,
  PhotoMetaDataDtoImpl
} from "./dto/photo-meta-data-result.dto";
import { PhotosResultDto } from "./dto/photos-result.dto";
import { PhotosRequestDto } from "./dto/photos.request.dto";
import { Photo } from './entites/photo.entity';

@Injectable()
export class PhotosService {

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {
  }

  async create(photo: Photo): Promise<Photo> {
    return this.photoRepository.save(photo);
  }

  async getMetaData(): Promise<PhotoMetaDataDto> {
    const dataSource = await getPostgresDataSource();
    const tagRepository = await dataSource.manager.getRepository(Tag);
    const tags = await tagRepository.find();
    const tagCounts: PhotoCountByTag[] = [];
    let count: number;
    for (const tag of tags) {
      count = await this.queryPhotoCountOfTag(tagRepository, tag.id);
      tagCounts.push(new PhotoCountByTagImpl(tag.id, count))
    }
    return new PhotoMetaDataDtoImpl(tagCounts);
  }

  async getPhotos(dto: PhotosRequestDto): Promise<PhotosResultDto> {
    const photos = await this.photoRepository.find(getFindPhotosWithTagsOptions(dto));
    const count = await this.photoRepository.count();
    return {photos: photos, availablePhotos: count};
  }

  async findOne(id: string): Promise<Photo> {
    return this.photoRepository.findOneBy({id: id});
  }

  /**
   * @param id
   * will use to update tags
   */
  async findOneWithTags(id: string): Promise<Photo> {
    return this.photoRepository.findOne(getFindPhotoWithTagsOptions(id));
  }

  async replace(photo: Photo) {
    return this.photoRepository.update(photo.id, {tags: photo.tags});
  }

  async update(id: string, photo: Partial<Photo>) {
    // todo calling 'update' throws error
    return this.photoRepository.save(photo);
  }

  async removeOne(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findOneBy({id: id});
    return this.photoRepository.remove(photo);
  }

  async deleteMany(ids: string[]): Promise<DeleteResult> {
    return this.photoRepository.delete(ids);
  }

  private async queryPhotoCountOfTag(tagRepository: Repository<Tag>, tagId: string): Promise<number> {
    return await tagRepository.createQueryBuilder('tag')
      .leftJoinAndSelect("tag.photos", "photo")
      .where("tag.id = :id", {id: tagId})
      .getOne().then(tag => tag.photos.length);
  }
}

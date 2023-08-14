import { PhotosRequestDto } from "@modules/photos/dto/photo.dto";
import { findPhotoByIdWithTagsOptions, getFindPhotosWithTagsOptions } from "@modules/photos/find-options";
import { Tag } from "@modules/tags/entities/tag.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { getPostgresDataSource } from "../../postgres.datasource";
import {
  PhotoCountByTag,
  PhotoCountByTagImpl,
  PhotoMetaDataDto,
  PhotoMetaDataDtoImpl,
  PhotosResultDto
} from "./dto/photo.dto";
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
    const allPhotosCount = await this.photoRepository.count();
    const tagRepository = dataSource.manager.getRepository(Tag);
    const tags = await tagRepository.find();
    const tagCounts: PhotoCountByTag[] = [];
    let count: number;
    for (const tag of tags) {
      count = await this.queryPhotoCountOfTag(tagRepository, tag.id);
      tagCounts.push(new PhotoCountByTagImpl(tag.id, count))
    }
    // console.log('PhotosService getMetaData: ',tagCounts)
    return new PhotoMetaDataDtoImpl(allPhotosCount, tagCounts);
  }

  async getPhotos(dto: PhotosRequestDto): Promise<PhotosResultDto> {
    // const dataSource = await getPostgresDataSource();
    // const tagRepository = await dataSource.manager.getRepository(Tag);
    // const tagId = '0d69c1f6-bd3c-46f6-8af5-c3b0667e4ed5';
    // const tag = await tagRepository.findOneBy({id: tagId});
    // console.log('tag: ', tag)
    // await this.photoRepository.createQueryBuilder('photo')
    //   // .leftJoinAndSelect("tag.photos", "photo")
    //   .where("tag.id = :id", {id: tagId})
    //   .getOne()

    // const posts = await this.photoRepository.createQueryBuilder("photo")
    //   .where("photo.authorId IN (:...authors)", {authors: [3, 7, 9]})
    //   .orderBy("post.createDate")
    //   .getMany();

    // let tags = await tagRepository.findBy({
    //   id: In(dto.tagIds)
    // });

    // const tags = await tagRepository.findBy({
    //   photos: ArrayContains(["TypeScript"]),
    // })

    // let q = await this.photoRepository.createQueryBuilder("photo")
    //   .groupBy("user.name")
    //   .addGroupBy("user.id");


    /*    const photos1 = await this.photoRepository
          .createQueryBuilder("photo")
          .leftJoin("photo.tags", "tags")
          .leftJoin("tags.name", "name")
          .where("photo.rating=5")
          .getMany();

        console.log('PhotosService getPhotos: ', photos1)*/


    // const res = await this.photoRepository
    //   .createQueryBuilder('photo')
    //   .leftJoinAndSelect("photo.tags", "tags")
    //   .where('ARRAY[tags] = ARRAY[:tags]', {
    //     tags: [tag],
    //   })
    //   // .andWhere('Company.isArchived=:isArchived', { isArchived: false })
    //   .getMany();
    // console.log('PhotosService getPhotos: ', res)

    // const photo1 = await this.photoRepository.findBy({
    //   tags: {
    //     id: In([tagId])
    //   }
    // });
    // console.log('Photo 1: ', photo1)

    // const photos2 = await this.photoRepository.findBy({
    //   // tags: ArrayContainedBy([tag])
    //   tags: ArrayContains([tag])
    //   // rating: MoreThan(4)
    // });
    // console.log('Photo 2: ', photos2)

    // const query = this.conn
    //   .getRepository(UserEntity)
    //   .createQueryBuilder("user");
    //
    // // Optionally add where condition
    // if (dto.search) {
    //   query.where("user.firstName LIKE :search", {search: dto.search})
    // }

    const photos = await this.photoRepository.find(getFindPhotosWithTagsOptions(dto));
    const count = await this.photoRepository.count();
    return {photos: photos, availablePhotos: count};
  }

  async findOne(id: string): Promise<Photo> {
    return this.photoRepository.findOneBy({id: id});
  }

  /**
   * will use to update tags
   */
  async findOneWithTags(id: string): Promise<Photo> {
    return this.photoRepository.findOne(findPhotoByIdWithTagsOptions(id));
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

  deleteAll(): Promise<DeleteResult> {
    return this.photoRepository.delete({});
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

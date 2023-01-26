import { PhotosRequestDto } from "@modules/photos/dto/photos.request.dto";
import { Photo } from "@modules/photos/entites/photo.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

export function getFindPhotosWithTagsOptions(dto: PhotosRequestDto): FindManyOptions<Photo> {
  return {
    select: {
      id: true,
      rating: true,
      created: true,
      recordDate: true,
      isPrivate: true,
      fileName: true,
      user: {
        id: true
      },
      tags: {
        id: true,
        name: true,
        //group
      }
    }, relations: {
      user: true,
      tags: true
    }, order: {
      recordDate: "ASC",
    },
    skip: dto.from,
    take: dto.take
  }
}

export function getFindPhotoWithTagsOptions(id: string): FindOneOptions<Photo> {
  return {
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
  }
}

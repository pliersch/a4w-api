import { PhotosRequestDto } from "@modules/photos/dto/photo.dto";
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
        id: true,
        givenName: true,
        surName: true,
      }, tags: {
        id: true,
        name: true,
        //group
      }
    },
    // where: {
    //   rating: MoreThan(4),
    // },
    relations: {
      user: true,
      tags: true
    },
    order: {
      recordDate: "DESC",
    },
    skip: dto.from,
    take: dto.take
  }
}

export function findPhotoByIdWithTagsOptions(id: string): FindOneOptions<Photo> {
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

import { Photo } from "@modules/photos/entites/photo.entity";

export class PhotosRequestDto {
  readonly from?: number = 1;
  readonly take?: number = 60;
  readonly tagIds: string[] = [];
}

export interface PhotosResultDto {
  photos: Photo[];
  availablePhotos: number;
}

export class UpdatePhotoDto {
  id: string;
  addedTagIds?: string[];
  removedTagIds?: string[];
  private?: boolean;
  rating?: number;
}

export class UpdatePhotoResultDto extends UpdatePhotoDto {
  // id: string;
  // addedTagIds?: string[];
  // removedTagIds?: string[];
  // private?: boolean;
}

export class DeletePhotoResultDto {
  id: string;
}

export interface PhotoCountByTag {
  tagId: string;
  count: number;
}

export class PhotoCountByTagImpl implements PhotoCountByTag {
  tagId: string;
  count: number;

  constructor(tagId: string, count: number) {
    this.tagId = tagId;
    this.count = count;
  }
}

export interface PhotoMetaDataDto {
  allPhotosCount: number;
  photoCountByTags: PhotoCountByTag[];
}

export class PhotoMetaDataDtoImpl implements PhotoMetaDataDto {
  allPhotosCount: number;
  photoCountByTags: PhotoCountByTag[];

  constructor(allPhotosCount: number, photoCountByTags: PhotoCountByTag[]) {
    this.allPhotosCount = allPhotosCount;
    this.photoCountByTags = photoCountByTags;
  }
}

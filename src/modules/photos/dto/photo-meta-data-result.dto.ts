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

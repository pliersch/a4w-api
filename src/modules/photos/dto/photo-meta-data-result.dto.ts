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
  photoCountByTags: PhotoCountByTag[];
}

export class PhotoMetaDataDtoImpl implements PhotoMetaDataDto {
  photoCountByTags: PhotoCountByTag[];

  constructor(photoCountByTags: PhotoCountByTag[]) {
    this.photoCountByTags = photoCountByTags;
  }
}

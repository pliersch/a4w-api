import { Photo } from "../entites/photo.entity";

export interface PhotosResultDto {
  photos: Photo[];
  availablePhotos: number;
}

export class UpdatePhotoDto {
  id: string;
  addedTagIds?: string[];
  removedTagIds?: string[];
  private?: boolean;
  rating?: number;
}

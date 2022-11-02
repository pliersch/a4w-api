export class UpdateTagGroupResultDto {
  id: string;
  name?: string;
  priority?: number;
  addedTags: string[];
  removedTagIds?: string[];
}

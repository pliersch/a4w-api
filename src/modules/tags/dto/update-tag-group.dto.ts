export class UpdateTagGroupDto {
  id: string;
  name?: string;
  priority?: number;
  addedNames?: string[];
  removedTagIds?: string[];
}

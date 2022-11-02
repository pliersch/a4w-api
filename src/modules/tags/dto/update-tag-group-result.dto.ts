import { Tag } from "@modules/tags/entities/tag.entity";

export class UpdateTagGroupResultDto {
  id: string;
  name?: string;
  priority?: number;
  addedTags?: Tag[];
  removedTagIds?: string[];
}

import { PartialType } from "@nestjs/mapped-types";
import { Photo } from "@modules/photos/entites/photo.entity";
import { Tag } from "@modules/tags/entities/tag.entity";

export class UpdatePhotoDto extends PartialType(Photo) {
  tags: Tag[];
}

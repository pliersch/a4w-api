export class PhotosRequestDto {
  readonly from?: number = 1;
  readonly take?: number = 60;
  readonly tagIds: string[] = [];
}

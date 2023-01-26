import { Order } from "@common/constants/order.constant";

export class PhotosRequestDto {
  readonly order?: Order = Order.ASC;
  readonly from?: number = 1;
  readonly take?: number = 60;
  readonly tagIds: string[] = [];
}

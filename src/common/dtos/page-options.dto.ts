import { Order } from "../constants/order.constant";

export class PageOptionsDto {
  readonly order?: Order = Order.ASC;

  readonly page?: number = 1;

  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

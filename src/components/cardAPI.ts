import {ICard, ICardAPI, IOrder, IOrderResult} from "../types";
import {Api, ApiListResponse, ApiOrderResponse} from "./base/api";

export class CardAPI extends Api implements ICardAPI {
  readonly cdn: string;
  constructor(cdn: string, baseURL: string, options?: RequestInit) {
    super(baseURL, options);
    this.cdn = cdn
  }

  getCards(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) => {
      return data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image
      }))
    })
  }

  sendOrder(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
      (data: ApiOrderResponse<IOrderResult>) => data
    )
  }
}

import {IBasketData, ICard} from "../../types";

export class BasketData implements IBasketData{
  protected _basketItems: Set<ICard>;

  constructor() {
    this._basketItems = new Set();
  }

  changeItem(data: ICard){
    if(!this.hasItem(data)) this.addItem(data);
    else this.removeItem(data);
  }

  hasItem(data: ICard): boolean {
    return Array.from(this._basketItems).some(item => item.id === data.id)
  }
  addItem(data: ICard) {
    this._basketItems.add(data);
  }
  removeItem(data: ICard) {
    this._basketItems.forEach(item => {
      if (item.id === data.id) this._basketItems.delete(item)
    })
  }
  clearBasket() {
    this._basketItems.clear();
  }
  get count() {
    return this._basketItems.size;
  }
  get total() {
    return Array.from(this._basketItems).reduce((acc, val) => acc + val.price,0)
  }
  get items() {
    return Array.from(this._basketItems);
  }
}
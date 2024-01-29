import {Component} from "../base/Component";
import {ICardBasket} from "../../types";

export class CardBasket extends Component<HTMLElement> implements ICardBasket{
  private _id: string;

  init() {
    this.element('button').bindEvent('click', 'remove-item', {card: this});
    this.element('button').on('remove-item', () => {
      this.remove()
      this.events.emit('change-item', {card: this});
      this.events.emit('show-basket');
    })
  }
  set price(value: number | null) {
    const translatedPrice = value ? `${value} синапсов` : 'Бесценно';
    this.element('price').setText(translatedPrice);
  }
  set title(value: string) {
    this.element('title').setText(value);
  }
  set id(value: string) {
    this._id = value;
  }
  get id() {
    return this._id;
  }
}
import {Component, elementMode} from "../base/Component";
import {IBasket, ICard} from "../../types";
import {CardBasket} from "./cardBasket";
import {EventEmitter} from "../base/events";

export class Basket extends Component<HTMLDivElement> implements IBasket{
  init() {
    this.element('button').bindEmitter(this.events).bindEvent('click', 'make-order');
  }

  setBasketItems(basketItemTemplate: string, basketItems: ICard[], emitter: EventEmitter): void {
    this.clearBasket();
    basketItems.forEach((basketItem, index) => {
      const cardElement = CardBasket.clone<CardBasket>(basketItemTemplate, basketItem, 'card', emitter);
      cardElement.element('basket__item-index', elementMode.independent).setText(String(index + 1));
      this.element('list').append(cardElement)
    })
  }

  clearBasket() {
    this.element('list').setContent();
  }

  set total(value: number) {
    this.element('price').setText(`${value} синапсов`)
  }
}
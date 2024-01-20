import {View} from "./base/view";
import {ICard} from "../types";

export class BasketItem extends View<HTMLDivElement, ICard, 'delete', never> {
  init() {
    this.element('delete')
  }
}
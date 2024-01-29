import {bem} from "../../utils/utils";
import {CardBasket} from "./cardBasket";
import {ICardGallery} from "../../types";

export class CardGallery extends CardBasket implements ICardGallery{
  init() {
    this.bindEvent('click', 'show-preview', {card: this, emitter: this.events})
  }
  protected getCategoryStyleModificator(value: string): string {
    switch(value) {
      case 'софт-скил':  return 'soft';
      case 'другое':  return 'other';
      case 'дополнительное':  return 'additional';
      case 'кнопка':  return 'button';
      case 'хард-скил':  return 'hard';
      default: throw new Error('Incorrect category style value');
    }
  }
  set image(src: string){
    this.element('image').setLink(src);
  }
  set price(value: number | null) {
    super.price = value;
  }
  set title(value: string) {
    super.title = value;
    this.element('image').setText(value);
  }
  set category(value: string) {
    const element = this.element('category')
    element.setText(value);
    element.addClass(bem(this.name, 'category', this.getCategoryStyleModificator(value)).name);
  }
  set id(value: string) {
    super.id = value;
  }
  get id(): string {
    return super.id;
  }

}
import {View} from "./base/view";

interface ICardData {
  image: string;
  title: string;
  price: number | null;
  category: string;
  description: string;
}

export class Card extends View<HTMLButtonElement, ICardData, 'click', never> {
  protected init() {
    this.bindEvent('click');
  }
  set image(src: string){
    this.element('image').setLink(src);
  }
  set title(value: string) {
    this.element('title').setText(value);
    this.element('image').setText(value);
  }
  set price(value: number | null) {
    const translatedPrice = value ? `${value} синапсов` : 'Бесценно';
    this.element('price').setText(translatedPrice);
  }
  set category(value: string) {
    this.element('category');
  }
}

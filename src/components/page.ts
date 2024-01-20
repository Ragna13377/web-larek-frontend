import {Gallery, IGallery} from "./common/gallery";
import {View} from "./base/view";
import {ICard} from "../types";
import {Card} from "./card";

interface IPage {
  counter: number;
  gallery: IGallery;
}

interface PageConfiguration {
  modalTemplate: string;
  contentTemplate: string;
}

export class Page extends View<HTMLButtonElement, IPage, 'open-basket', 'locked'> {
  protected _cardView: Card;
  protected _basketItems: ICard[] = [];

  protected init() {
    // this.select('openBasket', '.header__basket').bindEvent('click', 'open-basket');
    this.select('gallery', '.gallery', Gallery)
  }
  protected selectCard = (card: ICard): (event: object) => void => () => {
    this._cardView.render(card);
  }

  set counter(value:number) {
    this.select('counter', '.header__basket-counter').setText(`${value}`)
  }

  setCards (cards: ICard[], template: string) {
    const items = cards.map((card) => {
      return Card.clone<Card>(template, card)
    });
    this.element<Gallery>('gallery').render({items})
  }
}
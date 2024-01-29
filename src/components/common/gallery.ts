import {Component} from "../base/Component";
import {ICard, IGallery} from "../../types";
import {CardGallery} from "./cardGallery";
import {EventEmitter} from "../base/events";

export class Gallery extends Component<HTMLDivElement> implements IGallery {
  setCards(cardTemplate: string, cardsData: ICard[], emitter: EventEmitter): void{
    cardsData.forEach(card => {
      this.append(CardGallery.clone<CardGallery>(cardTemplate, card, 'card', emitter));
    })
  }
}
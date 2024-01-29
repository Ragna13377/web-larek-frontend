import {CardGallery} from "./cardGallery";
import {ICardPreview} from "../../types";
enum cardStatus {added, removed}
export class CardPreview extends CardGallery implements ICardPreview {
  private state: cardStatus = cardStatus.removed;

  init(){
    this.element('button').bindEmitter(this.events).bindEvent('click','change-item', {card: this});
    this.element('button').on('change-item', this.changeStatus.bind(this));
  }
  set title(value: string) {
    super.title = value;
  }
  set image(src: string) {
    super.image = src;
  }
  set category(value: string) {
    super.category = value;
  }
  set price(value: number | null) {
    super.price = value;
  }
  set id(value: string) {
    super.id = value;
  }
  get id(): string {
    return super.id;
  }
  set description(value: string) {
    this.element('text').setText(value);
  }

  changeStatus() {
    if(this.state === cardStatus.removed) {
      this.element('button').setText('Убрать');
      this.state = cardStatus.added;
    } else {
      this.element('button').setText('Купить');
      this.state = cardStatus.removed;
    }
  }
}
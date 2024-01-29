import {Component, elementMode} from "../base/Component";
import {IPage} from "../../types";

export class Page extends Component<HTMLBodyElement> implements IPage{
  init() {
    this.element('header__basket', elementMode.independent).bindEmitter(this.events).bindEvent('click', 'open-basket');
  }

  lockScroll(state: boolean) {
    this.element('wrapper').toggle('locked', state);
  }
  set count(value: number) {
    this.element('header__basket-counter', elementMode.independent).setText(String(value))
  }
}
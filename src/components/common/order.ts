import {Component, elementMode} from "../base/Component";
import {Form} from "./form";

export class Order extends Form {
  buttons: Set<Component<HTMLButtonElement>>
  inputs: Set<Component<HTMLInputElement>>
  init() {
    super.init();
    this.inputs = this.configure( ['address']);
    this.buttons = new Set();
    this.buttons.add(this.element('button[name="card"]', elementMode.independent))
    this.buttons.add(this.element('button[name="cash"]', elementMode.independent))
    this.buttons.forEach((button) => {
      button.bindEvent('click', 'set-active', {payment: button.getAttribute('name')})
      button.on('set-active', this.setActive.bind(this))
      button.on('set-active', () => { this.events.emit('set-order',
        {prop: 'payment', propValue: button.getAttribute('name'), inputs: this.inputs}) })
    })
    this.element('button').bindEmitter(this.events).bindEvent('click', 'make-contacts');
  }

  setActive(data: {payment: string}) {
    this.buttons.forEach((item) => {
      if(item.getAttribute('name') === data.payment) item.toggleClass('button_alt-active', true);
      else item.toggleClass('button_alt-active', false)
    })
  }
}
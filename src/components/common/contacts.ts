import {Form} from "./form";

export class Contacts extends Form {
  init() {
    super.init();
    this.inputs = this.configure( ['email', 'phone']);
    this.element('button').bindEmitter(this.events).bindEvent('click', 'show-success');
  }
}
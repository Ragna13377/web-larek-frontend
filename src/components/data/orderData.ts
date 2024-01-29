import {ICard, IOrder} from "../../types";
import {Component} from "../base/Component";
import {EventEmitter} from "../base/events";

export class OrderData implements IOrder{
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: ICard[];
  constructor() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  setProperty<K extends keyof IOrder>(prop: K, propValue: IOrder[K]): void {
    if(this.hasOwnProperty(prop)) {
      if(typeof propValue === typeof this[prop]) {
        //@ts-ignore
        this[prop] = propValue;
      }
    }
  }
  getOrder(): IOrder {
    return this;
  }

  validateForm(prop: string, inputs: Set<Component<HTMLInputElement>>, events: EventEmitter): void {
    if(inputs) {
      const errorMessage: string[] = [];
      const inputValidation = Array.from(inputs).every(input => {
        if(!input.isValid()) {
          const message = input.getValidationMessage();
          if(message) errorMessage.push(message);
          return false
        }
        return true
      })
      let buttonValidation = true;
      if(prop === 'address') buttonValidation = !!this.payment
      if(!buttonValidation) errorMessage.push('Выберите способ оплаты')
      if(inputValidation && buttonValidation) {
        events.emit('validated', {state: true, error: []})
      } else {
        events.emit('validated', {state: false, error: errorMessage})
      }
    }
  }

}
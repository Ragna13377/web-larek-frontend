import {Component, elementMode} from "../base/Component";
import {IForm} from "../../types";

export class Form extends Component<HTMLFormElement> implements IForm{
  inputs: Set<Component<HTMLInputElement>>
  init() {
    this.on('validated', (data: {state: boolean, error: string[]}) => {
      this.validateButton(data.state)
      this.showError(data.error)
    })
  }
  configure(keys: string[]): Set<Component<HTMLInputElement>> {
    const elements = new Set<Component<HTMLInputElement>>();
    keys.forEach(key => {
      const element = this.element(`form__input[name=${key}]`, elementMode.independent)
      if(element) elements.add(element);
    })
    elements.forEach(element => {
      element.bindEmitter(this.events).bindEvent('change');
      element.on('change', () => this.events.emit('set-order',
        {prop: element.getAttribute('name'), propValue: element.getInputValue(), inputs: elements,}))
    })
    return elements;
  }

  validateButton(state: boolean): void {
    this.element('button').toggleDisabled(!state)
  }

  showError(error: string[]): void {
    this.element('form__errors', elementMode.independent).setText(error.join('. '))
  }
}
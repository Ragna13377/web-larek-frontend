import {Component, elementMode} from "../base/Component";

export class Success extends Component<HTMLDivElement> {
  init() {
    this.element('button', elementMode.independent).bindEmitter(this.events).bindEvent('click', 'close')
    this.on('close', () => this.events.emit('clear-data'))
  }
}
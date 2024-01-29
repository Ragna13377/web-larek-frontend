import {Component, ContentValue} from "../base/Component";
import {IModal} from "../../types";

export class Modal extends Component<HTMLDivElement> implements IModal{
  init() {
    this.element('close').bindEvent('click', 'close-modal')
    this.element('close').on('close-modal', this.close.bind(this))
    if(!this.node.isConnected) {
      document.body.append(this.node);
    }
  }
  set content(content: ContentValue | null) {
    this.element('content').setContent(content);
  }

  setActive(state: boolean) {
    if(state) {
      this.toggle('active', true);
      this.events.emit('open-modal')
    } else {
      this.toggle('active', false);
      this.events.emit('close-modal')
    }
  }

  close() {
    this.setActive(false);
    this.content = null;
  }
}
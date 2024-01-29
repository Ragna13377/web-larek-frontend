import {settings} from "../../utils/constants";
import {modal} from "../../index";
import {Success} from "../common/success";
import {EventEmitter} from "../base/events";
import {elementMode} from "../base/Component";

export function showSuccess(total: number, emitter: EventEmitter) {
  return new Promise<void>(() => {
    const success = Success.clone<Success>(settings.successTemplate, undefined, 'success', emitter)
    success.element('order-success__description', elementMode.independent).setText(`Списано ${total} синапсов`)
    modal.render({
      content: success
    })
    modal.setActive(true);
  })
}
import {modal} from "../../index";
import {Order} from "../common/order";
import {settings} from "../../utils/constants";
import {EventEmitter} from "../base/events";

export function makeOrder(emitter: EventEmitter) {
  return new Promise<void>(() => {
    const order = Order.clone<Order>(settings.orderTemplate, undefined,'order', emitter)
    modal.render({
      content: order
    })
    modal.setActive(true);
  })
}
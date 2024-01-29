import {basket, basketData, modal} from "../../index";
import {settings} from "../../utils/constants";
import {EventEmitter} from "../base/events";

export function openBasket(emitter: EventEmitter) {
  return new Promise<void>(() => {
    const basketCards = basketData.items;
    console.log(basketCards)
    if(basketCards.length > 0) {
      basket.setBasketItems(settings.basketItemTemplate, basketCards, emitter);
      basket.total = basketData.total;
      basket.element('button').toggleDisabled(false)
    } else {
      basket.clearBasket();
      basket.total = 0;
      basket.element('button').toggleDisabled(true)
    }
    modal.render({
      content: basket
    })
    modal.setActive(true);
  })
}
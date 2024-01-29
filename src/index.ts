import './scss/styles.scss';
import {API_URL, CDN_URL, settings} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {CardAPI} from "./components/cardAPI";
import {Gallery} from "./components/common/gallery";
import {Page} from "./components/common/page";
import {Component, elementMode} from "./components/base/Component";
import {CardData} from "./components/data/cardData";
import {Modal} from "./components/common/modal";
import {showPreview} from "./components/hanlder/showPreview";
import {openBasket} from "./components/hanlder/openBasket";
import {Basket} from "./components/common/basket";
import {BasketData} from "./components/data/basketData";
import {makeOrder} from "./components/hanlder/makeOrder";
import {CardBasket} from "./components/common/cardBasket";
import {OrderData} from "./components/data/orderData";
import {IOrder} from "./types";
import {makeContacts} from "./components/hanlder/makeContacts";
import {showSuccess} from "./components/hanlder/showSuccess";

export const events = new EventEmitter();

// Инициализация шаблонов
export const cardData = new CardData();
export const basketData = new BasketData();
export const orderData = new OrderData();
export const page = Page.mount<Page>('.page', undefined, 'page', events);
export const gallery = Gallery.mount<Gallery>('.gallery');
export const basket = Basket.clone<Basket>(settings.basketTemplate, undefined,'basket', events);
export const modal = Modal.clone<Modal>(settings.modalTemplate, undefined, 'modal', events);

// Инициализация эвентов в эмиттере
events.on('open-basket', () => openBasket(events));
events.on('change-item', (data: {card: CardBasket}) => { basketData.changeItem(cardData.getCardInfo(data.card.id)); page.count = basketData.count});
events.on('show-preview', showPreview);
events.on('make-order', () => {
  events.emit('set-order', {prop: 'items', propValue: basketData.items.map(item => item.id)})
  events.emit('set-order', {prop: 'total', propValue: basketData.total})
  makeOrder(events)
});
events.on('make-contacts', () => makeContacts(events));
events.on('show-success', (data:{event: Event}) => {
  data.event.preventDefault()
  api.sendOrder(orderData.getOrder())
    .then(() => showSuccess(basketData.total, events))
    .catch((err: string) => modal.element('form__errors', elementMode.independent).setText(err))
});
events.on('clear-data', () => {
  modal.close();
  basketData.clearBasket()
  page.count = 0;
})
events.on('set-order', (data: {prop: keyof IOrder, propValue: IOrder[keyof IOrder], inputs?: Set<Component<HTMLInputElement>>}) => {
  orderData.setProperty(data.prop, data.propValue);
  orderData.validateForm(data.prop, data.inputs, events);
})
events.on('open-modal', () => { page.lockScroll(true) });
events.on('close-modal', () => { page.lockScroll(false) });

const api = new CardAPI(CDN_URL, API_URL);
api.getCards()
  .then((cards) => {
    cardData.cache = cards;
    gallery.setCards(settings.cardTemplate, cards, events);
  })
  .catch((err: string) => console.error(err))

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})
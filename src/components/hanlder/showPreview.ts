import {modal, basketData, cardData} from "../../index";
import {CardPreview} from "../common/cardPreview";
import {settings} from "../../utils/constants";
import {CardGallery} from "../common/cardGallery";
import {EventEmitter} from "../base/events";

export function showPreview(data: {card: CardGallery, emitter: EventEmitter}) {
  return new Promise<void>(() => {
    const card = cardData.getCardInfo(data.card.id)
    const preview = CardPreview.clone<CardPreview>(settings.cardPreviewTemplate, card, 'card', data.emitter);
    if(basketData.hasItem(card)) preview.changeStatus();
    modal.render({
      content: preview
    })
    modal.setActive(true);
  })
}
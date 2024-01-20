import './scss/styles.scss';

import { CDN_URL, API_URL, settings } from "./utils/constants";
import { CardAPI } from "./components/cardAPI";

import { page } from "./components/screen/app";

const api = new CardAPI(CDN_URL, API_URL);
api.getCards()
  .then((cards) => {
    page.setCards(cards, settings.cardTemplate)
  })
  .catch((err: string) => console.log(err))




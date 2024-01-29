import {ICard, ICardData} from "../../types";

export class CardData implements ICardData{
  private _cache: ICard[];

  set cache(data: ICard[]) {
    this._cache = data;
  }

  get cache() {
    return this._cache;
  }

  getCardInfo(id: string): ICard {
    return this.cache.find((item => id === item.id))
  }

}
import {View} from "./base/view";
import {ICard} from "../types";
import {Card} from "./card";

export interface BasketConfiguration {
  basketItemTemplate: string;
  basketStorageKey: string;
}

export class Basket extends View<
  HTMLDivElement,
  ICard[],
  'add-item' | 'remove-item',
  never
  > {
  protected _basketItemTemplate: Card;
  protected _basketItems: Map<string, ICard> = new Map();
  protected _storageKey: string;



  save() {
    localStorage.setItem(
      this._storageKey,
      JSON.stringify(Array.from(this._basketItems.values()))
    );
  }

}
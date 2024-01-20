import {View} from "../base/view";

export type GalleryItem = View<HTMLElement, object, 'click', never>
export interface IGallery {
  items: GalleryItem[];
}

export class Gallery extends View<HTMLDivElement, IGallery, never, never> {
  protected _items: GalleryItem[] = [];

  set items(items: View<HTMLElement, object, 'click', never>[]) {
    this._items = items;
    this.clear();
    this.append(...items.map(item => item.on('click', this.trigger('item-click'))));
  }
}
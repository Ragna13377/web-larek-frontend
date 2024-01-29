import {EventEmitter} from "../components/base/events";
import {Component, ContentValue} from "../components/base/Component";

export interface ICard {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: ICard[];
}

export interface IOrderResult {
    id: string;
    total: number | null;
}

export interface ICardAPI {
    getCards: () => Promise<ICard[]>
    sendOrder: (order: IOrder) => Promise<IOrderResult>
}

export interface ICardBasket {
    id: string
    title: string
    price: number | null
}

export interface ICardGallery extends ICardBasket {
    image: string
    category: string
}

export interface ICardPreview extends ICardGallery {
    description: string
    changeStatus: () => void
}

export interface IPage {
    count: number
    lockScroll: (state: boolean) => void
}

export interface IGallery {
    setCards: (cardTemplate: string, cardsData: ICard[], emitter: EventEmitter) => void
}

export interface IBasket {
    total: number;
    setBasketItems: (basketItemTemplate: string, basketItems: ICard[], emitter: EventEmitter) => void
    clearBasket: () => void
}

export interface IBasketData {
    count: number
    total: number
    items: ICard[]
    changeItem: (data: ICard) => void
    hasItem: (data: ICard) => boolean
    addItem: (data: ICard) => void
    removeItem: (data: ICard) => void
    clearBasket: () => void
}

export interface IModal {
    content: ContentValue;
    setActive: (state: boolean) => void
    close: () => void
}

export interface IForm {
    inputs: Set<Component<HTMLInputElement>>
    configure(keys: string[]): Set<Component<HTMLInputElement>>
    validateButton(state: boolean): void
    showError(error: string[]): void
}

export interface ICardData {
    cache: ICard[]
    getCardInfo: (id: string) => ICard
}




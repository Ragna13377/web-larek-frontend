# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Компоненты модели данных (бизнес логика)

В папке проекта types представлены основные интерфейсы продукта и заказа, основанные на API сервера:
```javascript
export interface ICard {
id: string;
title: string;
description: string;
category: string;
image: string;
price: number | null;
}
```

```javascript
export interface IOrder {
payments: string;
address: string;
email: string;
phone: string;
items: ICard[];
}
```
### 1. Класс `View< NodeType extends HTMLElement, DataType extends object, Events extends string, Modifiers extends string> extends EventEmitter`
Он наследует все базовые методы EventEmitter.  
Собственные свойства класса:
* `protected node: NodeType` - элемент в формате HTMLElement
* `protected elements: Record<string, ViewElement>` - кэш дочерних элементов
* `readonly fieldNames: string[]` - свойства элемента доступные к присваиванию
* `readonly name: string` - имя элемента
 
#### Для работы с html элементами используются методы:
* `setText(value: string)` - установка текста или альтернативного текста для картинок
* `setLink(value: string)` - установка ссылок для картинок и ссылочных элементов
* `getValue(): string` - получение данные из поля ввода
* `disable()` - отключение интерактивности кнопки
* `enable()` - включение интерактивности кнопки
* `toggleDisabled(state?: boolean)` - переключение режима интерактивности кнопки, опционально можно передать конкретный параметр для установки атрибута `disabled`
#### Методы валидации:
* `isValid()` - проверка правильности введенного значения в поле ввода
* `getValidationMessage(): string | undefined` - получение сообщения об ошибке из data атрибута `validation-message` или стандартного из `validationMessage`. Возвращает `undefined` в случае, когда нет ошибки ввода.
#### Методы работы с классами:
* `addClass(className: string)` - добавление класса элементу
* `removeClass(className: string)` - удаление класса с элемента
* `toggleClass(className: string, state?: boolean)` - переключение добавления/удаления класса. Опциональный параметр добавляет/удаляет класс аналогично `addClass` и `disable`
* `hasClass(className: string): boolean` - проверка наличия класса на элементе
* `toggle(modifier?: Modifiers, state?: boolean)` - переключение добавления/удаления класса элемента по модификатору (БЭМ)
#### Методы работы с контентом:
* `clear()` - удаляет все содержимое элемента
* `replace(...items: ContentValue[])` - замена содержимого элемента
* `setContent(item?: ContentValue)` - замена содержимого элемента. Если передан без параметра, то очистка содержимого элемента
* `append(...items: ContentValue[])` - вставка узла или текста в конец элемента
* `prepend(...items: ContentValue[])` - вставка узла или текста в начало элемента
#### Методы работы с элементами:
* `static clone<T extends ViewElement>(templateId: string, data?: object, name?: string): T` - клонирование из шаблона в HTML и заполнение данными элемента (базовый метод `cloneTemplate` принимает только 1 аргумент - селектор и не позволяет сразу получить данные и установить их)
* `static mount<T extends ViewElement>(selectorElement: HTMLElement | string, data?: object, name?: string): T` - копирование элемента c HTML, не находящегося в шаблоне, и заполнение данными
* `public static factory<T extends ViewElement>(this: new (el: unknown, name?: string) => T, el: unknown, data?: object, name?: string): T` - фабричный метод создания и заполнения данными элемента
* `render(data?: DataType): NodeType` - получение самого HTML-элемента с возможностью заполнения данными
* `protected assign(data?: Record<string, any> & DataType)` - заполнение данными элемента (заполняются только те поля, которые присутствуют в HTMLElement)  
* `protected select<T extends ViewElement>(name: string, selector?: string, ClassType?: new (el: HTMLElement, name: string) => T): T` - добавляет в кэш элемента дочерний элемент
* `protected element<T extends ViewElement>(name: string, ClassType?: new (el: HTMLElement, name: string) => T): T` - обобщает работу поиска дочернего элемента

Методы родительского класса (on, off, emit) переписаны для добавления возможности вызова по цепочке
`bindEmitter(events: Map<EventName, Set<Subscriber>>)` - альтернативный способу `on` добавления нескольких событий и обработчиков событий в `EventEmitter` элемента
`bindEvent(sourceEvent: string, targetEvent?: Events, data?: object)` - установка слушателя событий на элементе с опциональной возможностью установки собственного названия события

### 1. Класс `class Basket extends View< HTMLDivElement, ICard[], 'add-item' | 'remove-item', never >`

Содержит функционал работы с корзиной. В интерфейсе содержится HTML-шаблон товара и ключ, по которому сохраняется значение в `localStorage`
```
interface BasketConfiguration {
    basketCardTemplate: string;
    basketStorageKey: string;
}
```
Собственные свойства:
* `protected _basketCardTemplate: Card`
* `protected _basketCards: Map<string, ICard> = new Map()`
* `protected _storageKey: string`

Методы:
* `save()` - сохранение корзины в `localStorage`
* `load()` - загрузка корзины из `localStorage`  
* `addCard(item: ICard): string` - добавление товара в корзину
* `removeCard(id: string)` - удаление товара из корзины
* `clearTickets()` - очистка корзины
* `configure({ ticketTemplate, basketStorageKey }: BasketConfiguration)` - базовая конфигурация корзины (установка шаблона и ключа сохранения в `localStorage`)
* `static total()` - получение цены заказа
* `startOrder()` - переключает модальное окно для заполнения контактной информации и способов платежа

### 2. Класс `Card extends View<HTMLButtonElement, ICardData, 'click', never>`  

Описывает поведение карточки в галерее
```
interface ICardGallery {
  image: string;
  title: string;
  price: number | null;
  category: string;
  description: string;
}
```
Собственные методы:
`getFullInfo()` - показ модального окна с полной информацией о товаре

### 3. Класс `CardAPI extends Api implements ICardAPI` 

Класс отвечающий за взаимодействие с сервером.  
```
interface ICardAPI {
  getCards: () => Promise<ICard[]>;
  sendOrder: (order: IOrder) => Promise<IOrderResult>
}
```
Собственные методы:  
* `getCards(): Promise<ICard[]>` - получение массива карточек товаров с сервера
* `sendOrder: (order: IOrder) => Promise<IOrderResult>` - отправка готового заказа на сервер

### 4. `Success extends View<HTMLDivElement, never, 'close', never>` 

Класс описывает элемент успешного оформления заказа в модальном окне

Собственные методы:
* `showSuccess()` - формирует шаблон успешного оформления, показывает сумму заказа и очищает корзину

### 5. `BasketItem extends View<HTMLDivElement, ICard, 'delete', never>`

Класс описывает элемент в корзине

### 6. `Order extends View< HTMLDivElement, never, 'change' | 'submit', never>`

Класс описывает структуру заказа.  
Собственные методы:
* `orderForm()` - проводит валидацию модального окна с заполнением способа платежа и адреса доставки
* `contactForm()` - проводит валидацию модального окна с формой контактов

### 7. `export class Page extends View< HTMLButtonElement, IPage, 'buy-card' | 'open-basket', 'locked'>`

Класс описывает структуру главной страницы с галереей карточек и хэдером
```
interface IPage {
	counter: number;
	gallery: IGallery;
}

interface PageConfiguration {
	modalTemplate: string;
	contentTemplate: string;
}
```

Собственные методы:
* `lockScroll(state: boolean)` - блокировка прокрутки страницы при открытии взаимодействии с модальным окном
* `setCards (cards: ICard[], template: string)` - устанавливает в галерею пришедшие с сервера данные о карточках товаров

### 8. `Gallery extends View<HTMLDivElement, IGallery, never, never>`

Описывает поведение галереи

```
type GalleryItem = View<HTMLElement, object, 'click', never>
interface IGallery {
	items: GalleryItem[];
}
```

### 9.  `Modal extends View< HTMLDivElement, IModal, 'close' | 'open' | 'hide', 'active'>`

Описывает поведение модального окна

```
interface IModal {
	content: ViewElement;
	actions: ViewElement[];
}
```

Собственные методы:

* `reset()` - очистка модального окна
* `setActive(state: boolean)` - изменение статуса видимости модального окна
* `static configure({ modalTemplate }: { modalTemplate: string }): Modal` - установка базового шаблона модального окна
* `render(modal: IModal)` - отображение контента
* `close()` - закрытие модального окна



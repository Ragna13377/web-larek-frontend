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

## Базовые классы

### 1. Класс `Api` работы с базовыми запросами к серверу

Методы `get(uri: string)` и `post(uri: string, data: object, method: ApiPostMethods = 'POST')` осуществляют базовые get и post запросы к серверу  
Метод `handleResponse(response: Response): Promise<object>` - осуществляет обработку пришедшего ответа с сервера (парсинг JSON, обработка ошибки)  

```javascript
type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

type ApiOrderResponse<Type> = {
    total: number,
    id: string
}
```
`ApiListResponse` и `ApiOrderResponse` - типы ответов сервера по запросам `product` и `order`

### 2. Класс `CardAPI extends Api implements ICardAPI` кастомных запросов к серверу

```javascript
interface ICardAPI {
  getCards: () => Promise<ICard[]>
  sendOrder: (order: IOrder) => Promise<IOrderResult>
}
```

* `getCards` - получает с сервера информацию о карточках товаров
* `sendOrder` - отправляет готовый заказ на сервер

### 3. Класс `EventEmitter implements IEvents` брокера событий

```javascript
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
* `on` - подписывает элемент на конкретное событие в `EventEmitter`  
* `onAll(callback: (event: EmitterEvent) => void)` - подписывает элемент на все события в `EventEmitter`  
* `off(eventName: EventName, callback: Subscriber)` - отписывает элемент с события в `EventEmitter`  
* `offAll()` - сбрасывает все события в `EventEmitter`  
* `emit` - запускает событие в `EventEmitter`  
* `trigger` - создает коллбек триггер, генерирующий событие при вызове  

### 4. Класс `Component<NodeType extends HTMLElement>` базовых событий всех элементов  

* `setText(value: string)` - устанавливает текст компоненте или альтернативный текст в изображении
* `setLink(value: string)` - устанавливает ссылку в изображении или в ссылочном компоненте
* `getInputValue(): string` - получает значение из поля ввода
* `addClass(className: string)` - добавляет класс компоненту
* `removeClass(className: string)` - удаляет класс с компонента
* `hasClass(className: string): boolean` - проверяет наличие класса у компонента
* `toggleClass(className: string, state?: boolean)` - переключает класс в компоненте
* `toggle(modifier: string, state?: boolean)` - переключает класс по модификатору в компоненте
* `disable()` - делает кнопку неактивной
* `enable()` - делает кнопку активной
* `toggleDisabled(state?: boolean)` - переключает состояние активации кнопки
* `isValid()` - проверяет валидацию поля ввода
* `getValidationMessage(): string | undefined` - получает сообщение об ошибке валидации поля ввода
* `getAttribute(value: string): string` - получает по имени атрибут компонента
* `remove()` - удаляет элемента из DOM
* `clear()` - удаляет контент компонента
* `setContent(item?: ContentValue)` - устанавливает контент компоненту
* `append(...items: ContentValue[])` - вставляет дочерние элементы в конец родительского
* `prepend(...items: ContentValue[])` - вставляет дочерние элементы в начало родительского
* `replace(...items: ContentValue[])` - заменяет контент в компоненте
* `on<T extends object>(eventName: EventName, handler: (data: T) => void)` - перезаписанное базовое свойство с возможностью вызова по цепочке
* `bindEvent(sourceEvent: string, targetEvent?: string, data?: object)` - устанавливает кастомное событие на компонент
* `bindEmitter(emitter: EventEmitter)` - присваивание EventEmitter компоненту
* `bem(element?: string, modifier?: string): { name: string; class: string }` - перезаписывает базовое свойство с указанием имени родительского компонента в БЭМ нотации
* `element<T extends Component<any>>(name: string, mode: elementMode = elementMode.parent): T` - поиск компонента среди дочерних
* `protected assign(data?: object)` - присваивание свойств доступных для записи компоненту
* `render<DataType extends object>(data?: DataType): NodeType` - вспомогательный метод возвращающий компонент и присваивающий свойства
* `protected static factory<T extends Component<any>>(this: new (el: unknown, name?: string, emitter?: EventEmitter) => T, el: unknown, data?: any, name?: string, emitter?: EventEmitter): T` - фабричный метод создания компонента
* `static clone<T>(templateId: string, data?: any, name?: string, emitter?: EventEmitter): T` - клонирование компонента из шаблона
* `static mount<T>(selectorElement: string, data?: any, name?: string, emitter?: EventEmitter): T` - создание компонента из элемента существующего на странице (не в шаблоне)
* `init()` - базовая конфигурация компонента

- `readonly name: string` - имя компонента
- `protected node: NodeType;` - HTML-элемент компонента
- `protected elements: Record<string, Component<NodeType>>;` - кэш дочерних компонентов
- `protected events: EventEmitter;` - брокер событий компонента
- `readonly fieldNames: string[];` - поля доступные для присваивания у компонента

## Классы отвечающие за отображение

### 1. Классы отображения элементов карточек товаров

* `CardBasket extends Component<HTMLElement> implements ICardBasket`
* `CardGallery extends CardBasket implements ICardGallery`
* `CardPreview extends CardGallery implements ICardPreview`

```javascript
interface ICardBasket {
    id: string
    title: string
    price: number | null
}
interface ICardGallery extends ICardBasket  {
  image: string
  category: string
}
interface ICardPreview extends ICardGallery {
  description: string
  changeStatus: () => void
}
```

Классы содержат свойства с дескрипторами доступа для заполнения информации в соответствующих элементах HTML-шаблонов.  
Метод `init` - устанавливает обработчики событий на элементы карточек через EventEmitter.

`CardPreview` и `CardGallery` содержат метод `getCategoryStyleModificator(value: string): string` - устанавливающий класс категорий.  
`CardPreview` имеет дополнительный метод `changeStatus` изменяющий надпись на кнопке превью для удаления/добавления товара в корзину.  

### 2. Класс `Page extends Component<HTMLBodyElement> implements IPage` отображения элемента главной страницы

```javascript
interface IPage {
    count: number
    lockScroll: (state: boolean) => void
}
```

Метод `lockScroll` - блокирует прокрутку страницы. Вызывается при открытии модального окна  
Свойство `count` - устанавливает количество товаров на значке корзины на главной странице

### 3. Класс `Gallery extends Component<HTMLDivElement> implements IGallery` отображения элемента галереи 

```javascript
interface IGallery {
    setCards: (cardTemplate: string, cardsData: ICard[], emitter: EventEmitter) => void
}
```

Метод `setCards` - создает карточки галереи и добавляет их к элементу галереи главной страницы

### 4. Класс `Basket extends Component<HTMLDivElement> implements IBasket` отображения элемента корзины

```javascript
interface IBasket {
    total: number;
    setBasketItems: (basketItemTemplate: string, basketItems: ICard[], emitter: EventEmitter) => void 
    clearBasket: () => void
}
```

Метод `setBasketItems` - создает, нумерует карточки корзины и добавляет их к элементу корзины  
Метод `clearBasket` - очищает корзину
Свойство `total` устанавливает цену в корзине

### 5. Класс `Modal extends Component<HTMLDivElement> implements IModal` отображения элемента модального окна

```javascript
interface IModal {
    content: ContentValue;
    setActive: (state: boolean) => void
    close: () => void
}
```

Метод `setActive` - переключает видимость модальное окно  
Метод `close` - закрывает модальное окно, удаляя контент  
Метод `init` - устанавливает обработчики событий на элементы модального окна через EventEmitter.
Свойство `content` - устанавливает содержимое модального окна

### 6. Классы отображения ступеней оформления заказа

* Базовый класс: `Form extends Component<HTMLFormElement> implements IForm`  
* `Order extends Form`
* `Contacts extends Form`

```javascript
interface IForm {
  inputs: Set<Component<HTMLInputElement>>
  configure(keys: string[]): Set<Component<HTMLInputElement>>
  validateButton(state: boolean): void
  showError(error: string[]): void
}
```

Метод `showError` - выводит ошибку валидации данных заказа  
Метод `validateButton` - делает активной/неактивной кнопку перехода на следующий этап оформления заказа  
Метод `configure` - устанавливает обработчики событий на поля ввода  
Свойство `inputs` - хранит поля ввода формы заказа
Дополнительный метод `setActive` в классе `order` - делает активными/неактивными кнопки выбора способа платежа  
Метод `init` осуществляет базовую настройку форму, устанавливая обработчики событий на элементы формы

### 7. Класс `Success` отображения элемента успешного оформления заказа

## Классы работы с данными

### 1. Класс `OrderData implements IOrder` - работа с данными заказа

```javascript
interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: ICard[];
}
```

Метод `setProperty<K extends keyof IOrder>(prop: K, propValue: IOrder[K]): void` - заполняет данные заказа приходящие с полей оформления  
Метод `getOrder(): IOrder` - получение всех данных о заказе  
Метод `validateForm(prop: string, inputs: Set<Component<HTMLInputElement>>, events: EventEmitter): void` - проверяет корректность введенных данных заказа

### 2. Класс `BasketData implements IBasketData`  

```javascript
interface IBasketData {
    count: number
    total: number
    items: ICard[]
    changeItem: (data: ICard) => void
    hasItem: (data: ICard) => boolean
    addItem: (data: ICard) => void
    removeItem: (data: ICard) => void
    clearBasket: () => void
}
```

* `hasItem(data: ICard): boolean` - проверяет наличие товара в корзине
* `addItem(data: ICard)` - добавляет товар в корзину
* `removeItem(data: ICard)` - удаляет товар из корзины
* `clearBasket()` - очищает корзину
* `changeItem(data: ICard)` - меняет наличие (добавляет/удаляет) товара в корзине
* `count` - возвращает количество товаров в корзине
* `total` - возвращает стоимость всех товаров в корзине
* `items` - возвращает все товары из корзины


### 3. Класс `CardData implements ICardData` кэширует данные карточек, пришедшие с сервера

```javascript
interface ICardData {
    cache: ICard[]
    getCardInfo: (id: string) => ICard
}
```

Метод `getCardInfo(id: string): ICard` - возвращает карточку из кэша по ее id

## Другие файлы 

В проекте присутствуют функции отображения информации в модальном окне
* `function showPreview(data: {card: CardGallery, emitter: EventEmitter}` - показ превью
* `function openBasket(data: {emitter: EventEmitter})` - показ корзины
* `function makeOrder(data: {emitter: EventEmitter})` - показ оформления заказа (способа платежа и адреса)
* `function makeContacts(data: {emitter: EventEmitter})` - показ оформления заказа (электронной почты и телефона)
* `function showSuccess()` - показ успешного оформления заказа

`index.ts` - создает все элементы необходимые для начала работы сайта (страницу, галерею, корзину, модальное окно и классы для работы с данными).  
Подписывает глобальный брокер событий на все кастомные события, получает данные о карточках товара с сервера

## Описание проекта

Проект состоит: 
* классы работающие с отображением визуальной составляющей конкретных элементов страницы. Устанавливают события, размещают данные в дочерних элементах. Папка `components/common`
* классы обрабатывающие данные, используемые для отображения. Кэшируют данные заказа, корзины, карточки, пришедшие с сервера. Позволяют в удобном формате вывести и обработать данные. Папка `components/data`
* функции запускающие отрисовку конкретных модальных окон. Папка `components/handler`
* базовые функции, используемые во всех компонентах. Являются расширением функционала стандартных функций JS. Папка `base`
* файл кастомного API `cardAPI` для выполнения запросов к серверу

Элементы внутри файлов отображения создают кастомные события при вызове стандартных (например клик).  
Брокер событий подписывается на кастомные события и вызывает необходимые функции.  
Есть возможность создания брокера событий для конкретного элемента, когда нет необходимости глубоко пробрасывать глобальный брокер.  
Классы в пределах проекта никак не связаны с другими классами и взаимодействуют только через передаваемые аргументы.  





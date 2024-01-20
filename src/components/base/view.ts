import {EventEmitter, EventName, Subscriber} from "./events";
import {bem, ensureElement, getObjectProperties, isEmpty, pascalToKebab} from "../../utils/utils";

export type EventData = {
  event: Event,
  element?: ViewElement | HTMLElement,
  block?: ViewElement | HTMLElement
};
export type ContentValue = ViewElement | Node | string;
export type ViewElement<T extends HTMLElement = HTMLElement> = View<T, object, string, string>
export class View<
  NodeType extends HTMLElement,
  DataType extends object,
  Events extends string,
  Modifiers extends string
> extends EventEmitter {
  protected node: NodeType;
  protected elements: Record<string, ViewElement>
  readonly fieldNames: string[];
  readonly name: string;

  constructor(node: NodeType, name?: string) {
    super();
    this.node = node;
    this.name = name ?? pascalToKebab(this.constructor.name);
    this.fieldNames = getObjectProperties(this, (_name, prop) => !!(prop.get || prop.set))
    this.elements = {};
    this.init()
  }
  protected init() {};

  render(data?: DataType): NodeType {
    this.assign(data)
    return this.node;
  }
  protected assign(data?: Record<string, any> & DataType){
    if(data) {
      Object.keys(data).map(key => {
        if(this.fieldNames.includes(key)) {
          //@ts-ignore
          this[key as string] = data[key]
        }
      })
    }
    return this;
  }
  //зачем дублировать?
  protected bem(element?: string, modifier?: string) {
    return bem(this.name, element, modifier)
  }
  toggle(modifier?: Modifiers, state?: boolean) {
    const bemName = this.bem(undefined, modifier).name;
    this.toggleClass(bemName, state);
    return this;
  }
  protected element<T extends ViewElement>(
    name: string,
    ClassType?: new (el: HTMLElement, name: string) => T
  ): T {
    if(!this.elements[name]) {
      const el = this.bem(name)
      this.select<T>(name, el.class, ClassType)
    }
    return this.elements[name] as T;
  }
  protected select<T extends ViewElement>(
    name: string,
    selector?: string,
    ClassType?: new (el: HTMLElement, name: string) => T
  ): T {
    if(!this.elements[name]) {
      const $el = ensureElement<HTMLElement>(selector, this.node);
      const el = this.bem(name);
      if(ClassType) {
        this.elements[name] = new ClassType($el, name)
      } else {
        this.elements[name] = new View<HTMLElement, object, string, string>(
          $el,
          el.name
        );
        this.elements[name].bindEmitter(this.events);
        console.log(this.elements[name])
      }
    }
    return this.elements[name] as T;
  }

  public static factory<T extends ViewElement> (
    this: new (el: unknown, name?: string) => T,
    el: unknown,
    data?: object,
    name?: string
  ): T {
    const instance = new this(el, name);
    if(data) instance.render(data);
    return instance;
  }
  static clone<T extends ViewElement>(
    templateId: string,
    data?: object,
    name?: string
  ): T {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if(template){
      const element = template.content.firstElementChild.cloneNode(true);
      return this.factory(element, data, name) as T;
    } else {
      throw new Error(`Doesn't find element with that ID`)
    }
  }
  static mount<T extends ViewElement>(
    selectorElement: HTMLElement | string,
    data?: object,
    name?: string
  ): T {
    const element = typeof selectorElement === 'string' ? ensureElement(selectorElement) : selectorElement;
    return this.factory(element, data, name) as T;
  }

  on<T extends object>(eventName: EventName, callback: (event: T) => void) {
    super.on(eventName, callback);
    return this;
  }
  off(eventName: EventName, callback: Subscriber) {
    super.off(eventName, callback);
    return this;
  }
  emit<T extends object>(eventName: Events, data?: T) {
    super.emit(eventName, data);
    return this;
  }
  bindEvent(sourceEvent: string, targetEvent?: Events, data?: object) {
    this.node.addEventListener(sourceEvent, (event: Event) => {
      this.emit((targetEvent ?? sourceEvent) as Events, {
        event,
        element: this,
        ...data
      })
    })
    return this;
  }
  bindEmitter(events: Map<EventName, Set<Subscriber>>) {
    this.events = events;
  }

  setText(value: string){
    if(!isEmpty(value)) {
      if(this.node instanceof HTMLImageElement){
        this.node.alt = value
      } else {
        this.node.textContent = value;
      }
    }
    return this;
  }
  setLink(value: string){
    if(!isEmpty(value)){
      if(this.node instanceof HTMLImageElement) {
        this.node.src = value
      }
      if(this.node instanceof HTMLAnchorElement) {
        this.node.href = value
      }
    }
    return this;
  }
  getValue(): string {
    if(this.node instanceof HTMLInputElement){
      return this.node.value
    } else {
      throw new Error('This element is not Input')
    }
  }
  disable() {
    if(this.node instanceof HTMLButtonElement) {
      this.node.disabled = true;
    } else {
      throw new Error(`Element doesn't have disable attribute`)
    }
    return this;
  }
  enable() {
    if(this.node instanceof HTMLButtonElement) {
      this.node.disabled = false;
    } else {
      throw new Error(`Element doesn't have disable attribute`)
    }
    return this;
  }
  toggleDisabled(state?: boolean) {
    if(isEmpty(state)){
      const currentState = this.node.getAttribute('disabled')
      return currentState === 'false' || currentState === null ? this.disable() : this.enable();
    } else {
      return state ? this.disable() : this.enable()
    }
  }

  isValid() {
    if(this.node instanceof HTMLInputElement) {
      return this.node.validity.valid;
    } else {
      throw new Error('This element is not Input')
    }
  }
  getValidationMessage():string | undefined {
    if(this.node instanceof HTMLInputElement) {
      return this.isValid() ? undefined : this.node.dataset['validation-message'] ?? this.node.validationMessage
    } else {
      throw new Error('This element is not Input')
    }
  }

  addClass(className: string) {
    this.node.classList.add(className);
    return this;
  }
  removeClass(className: string) {
    this.node.classList.remove(className);
    return this;
  }
  hasClass(className: string): boolean {
    return this.node.classList.contains(className);
  }
  toggleClass(className: string, state?: boolean) {
    if(isEmpty(state)){
      this.node.classList.toggle(className)
    } else if(state === true) {
      this.addClass(className)
    } else {
      this.removeClass(className)
    }
    return this;
  }

  clear() {
    this.node.replaceChildren();
    return this;
  }
  setContent(item?: ContentValue) {
    if(item) this.replace(item)
    else this.clear();
    return this;
  }
  append(...items: ContentValue[]) {
    for(const item of items) {
      if(item instanceof View) {
        this.node.append(item.render());
      } else {
        this.node.append(item)
      }
    }
  }
  prepend(...items: ContentValue[]){
    for(const item of items) {
      if(item instanceof View) {
        this.node.prepend(item.render())
      } else {
        this.node.prepend(item)
      }
    }
  }
  replace(...items: ContentValue[]) {
    for(const item of items) {
      if(item instanceof View) {
        this.node.replaceChildren(item.render())
      } else {
        this.node.replaceChildren(item)
      }
    }
  }
}

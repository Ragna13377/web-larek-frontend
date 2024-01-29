import {EventEmitter} from "./events";
import {bem, ensureElement, getObjectProperties, isEmpty, pascalToKebab} from "../../utils/utils";
import {EventName} from "./events";

/**
 * Базовый компонент
 */
export enum elementMode {
    parent,
    independent
}
export type ComponentElement<T extends HTMLElement = HTMLElement> = Component<T>
export type ContentValue = ComponentElement | Node | string
export class Component<NodeType extends HTMLElement> {
    readonly name: string;
    protected node: NodeType;
    protected elements: Record<string, Component<NodeType>>;
    protected events: EventEmitter;
    readonly fieldNames: string[];

    constructor(root: NodeType, name?: string, emitter?: EventEmitter) {
        this.node = root;
        this.name = name ?? pascalToKebab(this.constructor.name);
        this.fieldNames = getObjectProperties(this, (name, prop) => !!(prop.get || prop.set));
        this.elements = {};
        if(emitter) this.bindEmitter(emitter)
        else this.bindEmitter(new EventEmitter());
        this.init();
    }

    protected init() {}

    on<T extends object>(eventName: EventName, handler: (data: T) => void) {
        this.events.on(eventName, handler);
        return this;
    }
    bindEvent(sourceEvent: string, targetEvent?: string, data?: object) {
        this.node.addEventListener(sourceEvent, (event: Event) => {
            this.events.emit((targetEvent ?? sourceEvent), {
                event,
                element: this,
                ...data
            });
        });
        return this;
    }
    bindEmitter(emitter: EventEmitter) {
        this.events = emitter;
        return this;
    }

    static mount<T>(selectorElement: string, data?: any, name?: string, emitter?: EventEmitter): T {
        const element = document.querySelector(selectorElement)
        if(element) return this.factory(element, data, name, emitter) as T;
        else throw new Error('Doesnt find element with selector')
    }
    static clone<T>(templateId: string, data?: any, name?: string, emitter?: EventEmitter): T {
        const template = document.getElementById(templateId) as HTMLTemplateElement;
        if(template) {
            const element = template.content.firstElementChild.cloneNode(true);
            return this.factory(element, data, name, emitter) as T;
        }
        throw new Error('Doesnt find element with ID')
    }
    protected static factory<T extends Component<any>>(this: new (el: unknown, name?: string, emitter?: EventEmitter) => T, el: unknown, data?: any, name?: string, emitter?: EventEmitter): T {
        const instance = new this(el, name, emitter);
        if(data) instance.render(data)
        return instance;
    }

    render<DataType extends object>(data?: DataType): NodeType {
        this.assign(data);
        return this.node;
    }
    protected assign(data?: object) {
        if (data) Object.keys(data).map(key => {
            if (this.fieldNames.includes(key)) {
                //@ts-ignore
                this[key as string] = data[key];
            }
        });
    }

    bem(element?: string, modifier?: string): { name: string; class: string } {
        return bem(this.name, element, modifier)
    }
    element<T extends Component<any>>(name: string, mode: elementMode = elementMode.parent): T {
        if (!this.elements[name]) {
            const el = mode === elementMode.parent ? this.bem(name) : bem(name);
            const $el = ensureElement<HTMLElement>(el.class, this.node)
            this.elements[name] = new Component<any>($el, el.name);
        }
        return this.elements[name] as T;
    }

    clear() {
        this.node.replaceChildren();
        return this;
    }
    setContent(item?: ContentValue) {
        if(item) this.replace(item)
        else this.clear()
        return this;
    }
    append(...items: ContentValue[]) {
        for(const item of items) {
            if(item instanceof Component) {
                this.node.append(item.render());
            } else {
                this.node.append(item)
            }
        }
    }
    prepend(...items: ContentValue[]){
        for(const item of items) {
            if(item instanceof Component) {
                this.node.prepend(item.render())
            } else {
                this.node.prepend(item)
            }
        }
    }
    replace(...items: ContentValue[]) {
        for(const item of items) {
            if(item instanceof Component) {
                this.node.replaceChildren(item.render())
            } else {
                this.node.replaceChildren(item)
            }
        }
    }

    setText(value: string) {
        if(!isEmpty(value)) {
            if (this.node instanceof HTMLImageElement) {
                this.node.alt = value;
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
    getInputValue(): string {
        if(this.node instanceof HTMLInputElement){
            return this.node.value
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
    toggle(modifier: string, state?: boolean) {
        const bemName = this.bem(undefined, modifier).name;
        this.toggleClass(bemName, state)
        return this;
    }

    disable() {
        if(this.node instanceof HTMLButtonElement) {
            this.node.disabled = true
        } else {
         throw new Error('Element has not disabled state')
        }
        return this;
    }
    enable() {
        if(this.node instanceof HTMLButtonElement) {
            this.node.disabled = false
        } else {
            throw new Error('Element has not disabled state')
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
            throw new Error('Element has not validity state')
        }
    }
    getValidationMessage(): string | undefined {
        if(this.node instanceof HTMLInputElement) {
            if(this.node.validity.typeMismatch)
                return this.node.validationMessage
            else
                return this.node.dataset.validationMessage ?? this.node.validationMessage;
        } else {
            throw new Error('Element has not validity state')
        }
    }
    getAttribute(value: string): string {
        return this.node.getAttribute(value)
    }
    remove() {
        this.node.remove();
    }
}

import {modal} from "../../index";
import {settings} from "../../utils/constants";
import {EventEmitter} from "../base/events";
import {Contacts} from "../common/contacts";

export function makeContacts(emitter: EventEmitter) {
  return new Promise<void>(() => {
    const contacts = Contacts.clone<Contacts>(settings.contactsTemplate, undefined,'contacts', emitter)
    modal.render({
      content: contacts
    })
    modal.setActive(true);
  })
}
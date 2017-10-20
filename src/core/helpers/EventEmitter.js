import { EventEmitter } from 'events';

const Events = new class extends EventEmitter {
  dispatch(eventName, payload) {
    this.emit(eventName, payload);
  }

  subscribe(eventName, callback) {
    this.on(eventName, callback);
  }

  unsubscribe(eventName, listener) {
    this.removeListener(eventName, listener);
  }

  unsubscribeAll(eventName) {
    if (typeof eventName === 'string') {
      this.removeAllListeners(eventName);
    }
    else {
      for (let e of eventName) {
        this.removeAllListeners(e);
      }
    }
  }
};

Events.setMaxListeners(2);
window.EventEmitter = Events;

export const dispatch    = Events.dispatch.bind(Events);
export const subscribe   = Events.subscribe.bind(Events);
export const unsubscribe = Events.unsubscribe.bind(Events);

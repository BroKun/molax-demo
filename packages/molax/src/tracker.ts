// tslint:disable: no-any
import 'reflect-metadata';
import { Reaction, ReactiveSymbol } from "./types";

export class Tracker {
  protected triggers: Reaction[] = [];
  add(trigger: Reaction): void {
    if (!this.triggers.includes(trigger)) {
      this.triggers.push(trigger);
    }
  }
  notify(target?:any, prop?:any): void {
    const methods = this.triggers;
    this.triggers = [];
    methods.forEach(t => {
      if (typeof t === 'function') {
        t(target, prop);
      }
    });
  }
  static trigger(target:any, prop:any): void {
    const tracker: Tracker|undefined = Reflect.getMetadata(ReactiveSymbol.Tracker, target, prop);
    if (tracker) {
      tracker.notify(target, prop);
    }
  }
  static find(target:any, prop:any): Tracker|undefined {
    if(!Reflect.hasMetadata(ReactiveSymbol.TraceableProperty, target, prop)) {
      return undefined;
    }
    if(!Reflect.hasMetadata(ReactiveSymbol.Tracker, target, prop)) {
      const tracker = new Tracker();
      Reflect.defineMetadata(ReactiveSymbol.Tracker, tracker, target, prop);
      return tracker;
    }
    return Reflect.getMetadata(ReactiveSymbol.Tracker, target, prop);
  }
}

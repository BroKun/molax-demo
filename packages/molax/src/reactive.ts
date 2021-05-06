// tslint:disable: no-any

import { Tracker } from "./tracker";
import { ReactiveSymbol } from "./types";

export function reactiveArray(obj: Array<any>, target: any, targetInstance: any, property: any): void {
  return new Proxy(obj, {
    get(self:any, prop:string|symbol): any {
      if(prop === ReactiveSymbol.ObjectSelf) {
        return self;
      }
      return Reflect.get(self, prop);
    },
    set(self:any, prop:string|symbol, value: any): any {
      const result = Reflect.set(self, prop, value);
      Tracker.trigger(targetInstance, property)
      return result;
    }
  })
}

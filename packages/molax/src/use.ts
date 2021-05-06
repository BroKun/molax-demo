// tslint:disable: no-any
import { useContext,  useReducer } from 'react';
import { interfaces } from 'inversify';
import { InversifyContext } from './provider';
import { Reaction, ReactiveSymbol } from './types';
import { Tracker } from './tracker';

export interface Tracked {
  [ReactiveSymbol.ObjectSelf]: Object;
}
export function isTracked(target: Object):target is Tracked {
  return target && typeof target === 'object' && ReactiveSymbol.ObjectSelf in target;
}

export function getOrigin<T extends Object>(target: T): T {
  if(isTracked(target)) {
    return (target as any)[ReactiveSymbol.ObjectSelf];
  }
  return target;
}

function reactiveObject<T extends Object>(object:T, reaction:  React.DispatchWithoutAction):T  {
  const updator: Reaction = (target: any, prop: any) => {
    if (Reflect.hasMetadata(prop, reaction)) {
      reaction();
    }
  }
  const obj = getOrigin(object);
  return new Proxy(obj, {
    get(target:any, property:string|symbol): any {
      if (property === ReactiveSymbol.ObjectSelf) {
        return obj;
      }
      const tracker = Tracker.find(obj, property);
      if (tracker) {
        tracker.add(updator);
        Reflect.defineMetadata(property, true, reaction)
      }
      const value = target[property];
      if (typeof value === 'function') {
        return value.bind(obj);
      }
      return value;
    },
  })
}

export function useTrack<T extends Object>(obj: T):T {
  const [, forceUpdate] = useReducer<(prevState: number, action?: number) => number>(time => time + 1, 0);
  if (!Reflect.hasMetadata(forceUpdate, obj)) {
    const proxy = reactiveObject(obj, forceUpdate);
    Reflect.defineMetadata(forceUpdate, proxy, obj)
  }
  return Reflect.getMetadata(forceUpdate, obj)
};

export function useInject<T extends Object>(identifier: interfaces.ServiceIdentifier<T>):T {
  const { container } = useContext(InversifyContext);
  if (!container) { throw new Error(); }
  const obj = container.get<T>(identifier);
  return useTrack(obj)
};



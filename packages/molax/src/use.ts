import { useContext,  useReducer } from 'react';
import { interfaces } from 'inversify';
import { InversifyContext } from './provider';
import { setTarget, ObjectSelf, ObservePropMeta } from './core';
import { Observable, PrePropertySet } from './observable';

Reflect.defineMetadata(
  PrePropertySet,
  (target:object, propertyKey:string|symbol)=>{
    Reflect.defineMetadata(ObservePropMeta, [], target, propertyKey);
  },
  Observable
);

// tslint:disable-next-line:no-any
function proxy<T extends Object>(obj:T , hooks: React.Dispatch<any>):T  {
  const setProperty = setTarget(obj);
  return new Proxy(obj, {
    // tslint:disable-next-line:no-any
    get(target:any, name:string|symbol): any {
      // console.log('use proxy get', target===obj)
      if(name === ObjectSelf) {
        return obj;
      }
      if(name === '__molax_proxy_self__') {
        return obj;
      }
      const setHooks = setProperty(name)
      setHooks(hooks);
      const value = target[name];
      if(typeof value === 'function') {
        return value.bind(obj);
      }
      return value;
    },
  })
}

export function useInstance<T extends Object>(identifier: interfaces.ServiceIdentifier<T>):T {
  const { container } = useContext(InversifyContext);
  if (!container) { throw new Error(); }
  const obj = container.get<T>(identifier);
  const [times, forceUpdate] = useReducer<(prevState: number, action?: number) => number>(time => time + 1, 0);
  console.debug('useInstance reducer:', obj, times)
  return proxy(obj, forceUpdate);
};

// TODO: 增加tag/name实例的use引入

// TODO: bindToArray in Multidimensional Arrays
export function bindToArray<T extends Object>(item:T): T{
  const [times, forceUpdate] = useReducer<(prevState: number, action?: number) => number>(time => time + 1, 0);
  console.debug('bindToArray reducer:', item, times);
  return proxy(item, forceUpdate);
}

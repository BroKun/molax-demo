import { useContext,  useReducer } from 'react';
import { interfaces } from 'inversify';
import { InversifyContext } from './provider';
import { setHooksForTarget, ObjectSelf } from './core';

function proxy<T extends Object>(obj:T , hooks: React.Dispatch<any>):T  {
  const setForPorps = setHooksForTarget(obj);
  return new Proxy(obj, {
    get(target:any, name:string|symbol) {
      if(name === ObjectSelf) {
        return obj;
      }
      const setHooks = setForPorps(name)
      setHooks(hooks);
      return target[name];
    },
  })
}

export function useInstance<T extends Object>(identifier: interfaces.ServiceIdentifier<T>):T {
  const { container } = useContext(InversifyContext);
  if (!container) { throw new Error(); }
  const obj = container.get<T>(identifier);
  const [times, forceUpdate] = useReducer<(prevState: number, action?: number) => number>(time => time + 1, 0);
  console.log('useInstance reducer:', obj, times)
  return proxy(obj, forceUpdate);
};

// TODO: 增加tag/name实例的use引入

// TODO: bindItem api rename
// TODO: bindItem in Multidimensional Arrays
export function bindItem<T extends Object>(item:T): T{
  const [times, forceUpdate] = useReducer<(prevState: number, action?: number) => number>(time => time + 1, 0);
  console.log('bindItem reducer:', item, times);
  return proxy(item, forceUpdate);
}

export const ObservePropMeta = Symbol("ObservePropMeta");
export const ObjectSelf = Symbol('ObjectSelf');

export function setProp(context: object,target: object, propertyKey: string|symbol):void {
  const propMetas = Reflect.getMetadata(ObservePropMeta, context, propertyKey);
  if (!propMetas) {
    Reflect.defineMetadata(ObservePropMeta, [], context, propertyKey);
  }
}

export type notifyList = React.Dispatch<number | undefined>[];

export function notify(target: object, propertyKey: string):void {
  const propMetas: notifyList = [...Reflect.getMetadata(ObservePropMeta, target, propertyKey)];
  if(propMetas && propMetas.length>0) {
    Reflect.defineMetadata(ObservePropMeta, [], target, propertyKey);
    if (propMetas) {
      propMetas.forEach(n => {
        if(typeof n === 'function') {
          n(undefined);
        }
      });
    }
  }
}
type setHooks = (hook: React.Dispatch<number | undefined>)=> void;
type setHooksForProperty = (propertyKey: string|symbol)=> setHooks;

export function setHooks(target:object, propertyKey:string|symbol, hook: React.Dispatch<number | undefined>):void {
  const metas: notifyList = Reflect.getMetadata(ObservePropMeta, target, propertyKey);
      // TODO: 优化性能，不要线性比对
  if(!metas) {
    Reflect.defineMetadata(ObservePropMeta, [hook], target, propertyKey);
  } else {
    if(metas.indexOf(hook)<0) {
      metas.push(hook)
    }
  }
}
export function setProperty(target:object, propertyKey:string|symbol):setHooks {
  return (hook: React.Dispatch<number | undefined>) => setHooks(target, propertyKey, hook)
}


export function setTarget(target:object): setHooksForProperty{
  return (propertyKey:string|symbol) => setProperty(target, propertyKey);
}

export const ObservePropMeta = Symbol("ObservePropMeta");
export const ObjectSelf = Symbol('ObjectSelf');

export function setProp(context: object,target: object, propertyKey: string|symbol):void {
  const propMetas = Reflect.getMetadata(ObservePropMeta, context, propertyKey);
  if (!propMetas) {
    Reflect.defineMetadata(ObservePropMeta, [], context, propertyKey);
  }
}

export type notifyList = React.Dispatch<number | undefined>[];

export function notify(context: object, propertyKey: string):void {
  if(Reflect.hasOwnMetadata(ObservePropMeta, context, propertyKey)) {
    const propMetas: notifyList = Reflect.getMetadata(ObservePropMeta, context, propertyKey);
    Reflect.defineMetadata(ObservePropMeta, [], context, propertyKey);
    if (propMetas) {
      propMetas.forEach(n => {
        n(undefined);
      });
    }
  }
}
type setHooks = (hook: React.Dispatch<number | undefined>)=> void;
type setHooksForProperty = (propertyKey: string|symbol)=> setHooks;

export function setHooksForTarget(target:object): setHooksForProperty{
  // const prototype = Object.getPrototypeOf(target);
  return (propertyKey:string|symbol): setHooks =>
    (hook: React.Dispatch<number | undefined>): void =>{
      const metas: notifyList = Reflect.getMetadata(ObservePropMeta, target, propertyKey);
      // TODO: 优化性能，不要线性比对
      if(metas && !metas.includes(hook)) {
        metas.push(hook)
      }
    }
}

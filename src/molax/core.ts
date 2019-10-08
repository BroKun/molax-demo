export const ObservePropMeta = Symbol("ObservePropMeta");
export const ObjectSelf = Symbol('ObjectSelf');

export function setProp(context: any,target: any, propertyKey: string|symbol) {
  const propMetas = Reflect.getOwnMetadata(ObservePropMeta, context, propertyKey);
  if (!propMetas) {
    console.log('setProps:', ObservePropMeta, context, propertyKey);
    Reflect.defineMetadata(ObservePropMeta, [], context, propertyKey);
  }
}

export type notifyList = React.Dispatch<number | undefined>[];

export function notify(context: any, propertyKey: string) {
  console.log('调用notify:', context, propertyKey);
  if(Reflect.hasOwnMetadata(ObservePropMeta, context, propertyKey)) {
    const propMetas: notifyList = Reflect.getOwnMetadata(ObservePropMeta, context, propertyKey);
    Reflect.defineMetadata(ObservePropMeta, [], context, propertyKey);
    console.log('调用hooks数目:', propMetas.length);
    if (propMetas) {
      propMetas.forEach(n => {
        n(undefined);
      });
    }
  }
}
export function setHooksForTarget(target:any){
  // const prototype = Object.getPrototypeOf(target);
  return (propertyKey:string|symbol) => {
    return (hook: React.Dispatch<number | undefined>) =>{
      const metas: notifyList = Reflect.getOwnMetadata(ObservePropMeta, target, propertyKey);
      console.log(ObservePropMeta, target, propertyKey, metas)
      // TODO: 优化性能，不要线性比对
      if(metas && !metas.includes(hook)) {
        console.log('确认 setHooksForTarget:', ObservePropMeta, target, propertyKey);
        metas.push(hook)
      }
    }
  }
}

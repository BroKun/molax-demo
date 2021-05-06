// tslint:disable: no-any
import 'reflect-metadata';
import { Tracker } from './tracker';
import { ReactiveSymbol } from './types';
import { reactiveArray } from './reactive';
export const Observable = {};
export const PrePropertySet = Symbol('PrePropertySet');

type propDecorator = (target: object, propertyKey: string) => void;


export function prop():propDecorator {
  return (target: object, propertyKey: string) =>{
    // number → Number
    // string → String
    // boolean → Boolean
    // any → Object
    // void → undefined
    // Array → Array
    // Tuple → Array
    // class → constructor
    // Enum → Number
    // ()=>{} → Function
    // others(interface ...) → Object
    const propertyType = Reflect.getMetadata('design:type', target, propertyKey);
    // Mark properties on prototypes as traceable properties
    Reflect.defineMetadata(ReactiveSymbol.TraceableProperty, true, target, propertyKey);
    // 属性 getter
    let getter = function (this: any):void  {
      const value = Reflect.getMetadata(propertyKey, this);
      return value;
    };
    // 属性 setter
    let setter = function (this: any, val: any):void {
      let value = val;
      // TODO: 多个 target 共享的 property 引用
      // TODO: 多维数组支持
      if(propertyType === Array) {
        value = reactiveArray(val, target, this, propertyKey)
      }
      Reflect.defineMetadata(propertyKey, value, this)
      Tracker.trigger(this, propertyKey);
    };
    // 从类原型中删除原始属性，并使用原始属性的名称创建一个新的属性
    if (Reflect.deleteProperty(target, propertyKey)) {
      Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter,
      });
    }
  }
}

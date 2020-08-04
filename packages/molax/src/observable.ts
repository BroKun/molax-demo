import 'reflect-metadata';
import { notify } from './core';
export const Observable = {};
export const PrePropertySet = Symbol('PrePropertySet');


const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

// tslint:disable-next-line:no-any
export function defineArrayInstance(arr:any, instance: object, target: object, propertyKey: string):void {
  // tslint:disable-next-line:no-any
  methodsToPatch.forEach(function (method): any {
    const original = arr[method]
    // tslint:disable-next-line:no-any
    function mutator(this: object, ...args: any[]): any {
      const result = original.apply(this, args);
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) console.log('inserted', inserted);
      // notify change
      notify(instance, propertyKey);

      return result
    }
    Object.defineProperty(arr, method, {
      value: mutator,
      enumerable: true,
      writable: true,
      configurable: true
    })
  });
}
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
    // const propertyType = Reflect.getMetadata('design:type', target, propertyKey);

    // console.log('ob target', target, propertyKey);
    // let targetProxy = Reflect.getMetadata(ObjectProxy, target);
    // if(!targetProxy) {
    //   // 为宿主对象生成访问代理
    //   targetProxy = new Proxy(target, {
    //     // tslint:disable-next-line:no-any
    //     get(thisObj:any, name:string|symbol): any {
    //       if(name === ObjectSelf) {
    //         return thisObj;
    //       }
    //       if(name === '__molax_proxy_self__') {
    //         return thisObj;
    //       }
    //       // const value = thisObj[name];
    //       return thisObj[name];
    //     },
    //   })
    //   Reflect.defineMetadata(ObjectProxy, targetProxy, target);
    // }

    const prePropertySet = Reflect.getMetadata(PrePropertySet, Observable);
    prePropertySet(target, propertyKey);


    // 属性 getter
    // tslint:disable-next-line:no-any
    let getter = function (this: any):void  {
      // const thisObj = this[ObjectSelf]?this[ObjectSelf]:this;
      // const thisObj = Reflect.getMetadata(ObjectSelf, this)?Reflect.getMetadata(ObjectSelf, this):this;
      console.log('ob this getter', this, propertyKey);
      const value = Reflect.getMetadata(propertyKey, this);
      return value;
      // return targetProxy[propertyKey]
    };
    // 属性 setter
    // tslint:disable-next-line:no-any
    let setter = function (this: any, newVal: any):void {
      // 对于数组类型，需要接管数组的变更操作
      // TODO: 不鼓励多个对象共享数组，但是要兜这个底, 多个对象引用一个数组时，意味着数组更新动作将通知多个对象的属性更新，内部需要有一组notify，还需要在重新赋值时断开，需要考虑一个上层管理
      // TODO: 考虑对多维数组的处理
      console.log('ob this setter', this, propertyKey);
      Reflect.defineMetadata(propertyKey, newVal, this)
      notify(this, propertyKey);
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

/**
 * TODO:需要对访问器get的修饰器，用来支持计算属性的获
 * 修改get表现，关键点是能否获取到关联的基础属性，如果可以的话能够做到比较精确的关联更新，如果不能就与类关联，所有被修饰属性更新都触发，这样效率会受一些影响。
 */

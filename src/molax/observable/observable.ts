import { setProp, notify, ObjectSelf } from '../core';
import { defineArrayInstance } from './array';

export function prop() {
  return (target: any, propertyKey: string) =>{
    const propertyType = Reflect.getMetadata('design:type', target, propertyKey);
    // 属性 getter
    let getter = function (this: any) {
      const thisObj = this[ObjectSelf]?this[ObjectSelf]:this;
      setProp(thisObj, target, propertyKey);
      const value = Reflect.getOwnMetadata(propertyKey, thisObj);
      console.log(`Get: ${propertyKey} => `, value, thisObj);
      return value;
    };
    // 属性 setter
    let setter = function (this: any, newVal: any) {
      const thisObj = this[ObjectSelf]?this[ObjectSelf]:this;
      setProp(thisObj, target, propertyKey);
      if(propertyType === Array) {
        // 对于数组类型，需要接管数组的变更操作
        // TODO: 不鼓励多个对象共享数组，但是要兜这个底, 多个对象引用一个数组时，意味着数组更新动作将通知多个对象的属性更新，内部需要有一组notify，还需要在重新赋值时断开，需要考虑一个上层管理
        // TODO: 考虑对多维数组的处理
        defineArrayInstance(newVal, thisObj, target, propertyKey)
      }
      Reflect.defineMetadata(propertyKey, newVal, thisObj)
      console.log(`Set: ${propertyKey} => `, newVal, thisObj);
      notify(thisObj, propertyKey);
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
 * TODO:
 * 需要对访问器get的修饰器，用来支持计算属性的获
 * 修改get表现，关键点是能否获取到关联的基础属性，如果可以的话能够做到比较精确的关联更新，如果不能就与类关联，所有被修饰属性更新都触发，这样效率会受一些影响。
 */

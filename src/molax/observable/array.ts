// This file is inspired by Vue: https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js

import { notify } from '../core';

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

export function defineArrayInstance(arr:object, instance: object, target: object, propertyKey: string):void {
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

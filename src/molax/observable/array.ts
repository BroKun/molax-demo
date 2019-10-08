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

export function defineArrayInstance(arr:any, instance: any, target: any, propertyKey: string) {
  console.log('defineArrayInstance',arr)
  methodsToPatch.forEach(function (method) {
    const original = arr[method]
    function mutator(this: any, ...args:any[]) {
      console.log('mutator', this);
      const result = original.apply(this, args);
      console.log('arr', this);
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

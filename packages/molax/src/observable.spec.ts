import * as assert from 'power-assert';
import { prop } from './observable';
import { PrePropertySet, Observable } from './observable';
import { Tracker } from './tracker';
import { ReactiveSymbol } from './types';

Reflect.defineMetadata(
  PrePropertySet,
  (target:object, propertyKey:string|symbol)=>{
    Reflect.defineMetadata(ReactiveSymbol.Tracker, new Tracker(), target, propertyKey);
  },
  Observable
);

describe('observable', () => {
  class ClassA {
    @prop()
    name:string;
  }
  const instanceA = new ClassA();
  it('#basic usage', () => {
    let changed = false;
    const tracker = Tracker.find(instanceA, 'name')
    tracker?.add(()=>{
      changed = true;
    });
    instanceA.name = 'a'
    tracker?.add(()=>{
      changed = true;
    });
    instanceA.name = 'b'
    assert(instanceA.name==='b');
    assert(changed);
  });
});

import * as assert from 'power-assert';
import { prop } from './observable';
import { setTarget } from './core';


describe('observable', () => {
  class ClassA {
    @prop()
    name:string;
  }
  const instanceA = new ClassA();
  it('#basic usage', () => {
    let changed = false;
    setTarget(instanceA)('name')(()=>{
      changed = true;
    });
    instanceA.name = 'a'
    setTarget(instanceA)('name')(()=>{
      changed = true;
    });
    instanceA.name = 'b'
    assert(instanceA.name==='b');
    assert(changed);
  });
});

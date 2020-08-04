import * as assert from 'power-assert';
import {
  setTarget,
  setProp, ObservePropMeta,
  notify
} from './core';


describe('core', () => {
  const a = new Object();
  it('#set prop', () => {
    setProp(a, a, 'myProps1')
    const metas = Reflect.getMetadata(ObservePropMeta, a, 'myProps1');
    assert(metas instanceof Array && metas.length === 0)
  });
  it('#set hook', () => {
    setProp(a, a, 'myProps2')
    const hook = () => {};
    setTarget(a)('myProps2')(hook)
    const metas = Reflect.getMetadata(ObservePropMeta, a, 'myProps2');
    assert(metas && metas[0]=== hook)
  });

  it('#set hook twice', () => {
    setProp(a, a, 'myProps3')
    const hook = () => {};
    setTarget(a)('myProps3')(hook)
    setTarget(a)('myProps3')(hook)
    const metas = Reflect.getMetadata(ObservePropMeta, a, 'myProps3');
    assert(metas && metas[0]=== hook)
  });
  it('#notify', () => {
    setProp(a, a, 'myProps4')
    let count = 0;
    const hook = () => {count++};
    setTarget(a)('myProps4')(hook)
    notify(a, 'myProps4')
    assert(count=== 1)
  });
});

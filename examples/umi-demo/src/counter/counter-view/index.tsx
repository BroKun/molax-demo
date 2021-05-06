import React from 'react';
import { useInject } from 'molax/lib/use';
import { Counter } from '../counter';
import styles from './index.less';
import { Button } from 'antd';

export const CounterView: React.FC = () => {
  const counter = useInject<Counter>(Counter);
  return (
    <div className={styles.todo}>
      counter: {counter.value}
      <Button onClick={()=>{counter.add()}}>+</Button>
    </div>
  );
};

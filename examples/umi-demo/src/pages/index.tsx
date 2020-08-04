import React from 'react';
import styles from './index.less';
import { container } from '../ioc';
import { Provider } from 'molax/lib/provider';
import {  ToDo  } from '../todo-list/todo-view';
import { CounterView } from '@/counter/counter-view';

export default function(): React.ReactNode {
  return (
    <div className={styles.normal}>
      <Provider container={container}>
        <div>
          <CounterView />
          <ToDo/>
        </div>
      </Provider>
    </div>
  );
}

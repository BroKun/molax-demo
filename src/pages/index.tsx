import React from 'react';
import styles from './index.css';
import { container } from '@/ioc';
import { Provider } from '@/molax/provider';
import {  ToDo  } from '@/todo-list/todo-view';

export default function(): React.ReactNode {
  return (
    <div className={styles.normal}>
      <Provider container={container}>
        <div>
          <ToDo/>
        </div>
      </Provider>
    </div>
  );
}

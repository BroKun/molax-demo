import React from 'react';
import { useInstance } from 'molax/lib/use';
import { Card } from 'antd';
import { ToDoManager } from '../manager';
import { TodoAdd } from './todo-add';
import { ToDoCount } from './count';
import styles from './index.less';

export const ToDo: React.FC = () => {
  const manager = useInstance<ToDoManager>(ToDoManager);
  return (
    <div className={styles.todo}>
      <ToDoCount />
      <TodoAdd />
      <Card title="Todo List">
        {manager.collection.map((todo)=>{
          const ItemView = manager.getRender(todo);
          return (<ItemView key={todo.id} todo={todo}/>)
        })}
      </Card>
    </div>
  );
};

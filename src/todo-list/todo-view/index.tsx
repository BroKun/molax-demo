import React from 'react';
import { useInstance } from '@/molax/use';
import { ToDoManager } from '@/todo-list/manager';
import ToDoAdd from '@/todo-list/todo-add';
import { Card } from 'antd';
import styles from './index.css';

export const ToDo: React.FC = () => {
  const manager = useInstance<ToDoManager>(ToDoManager);
  return (
    <div className={styles.todo}>
      <ToDoAdd />
      <Card title="Todo List">
        {manager.collection.map((todo)=>{
          const ItemView = manager.getRender(todo);
          return (<ItemView key={todo.id} todo={todo}/>)
        })}
      </Card>
    </div>
  );
};

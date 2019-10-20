import React from 'react';
import { useInstance } from '@/molax/use';
import { ToDoManager } from '@/todo-list/manager';
import { ToDoItemView } from '@/todo-list/todo-item-view';
import ToDoAdd from '@/todo-list/todo-add';
import { Card } from 'antd';
import styles from './index.css';

export const ToDo: React.FC = () => {
    const manager = useInstance<ToDoManager>(ToDoManager);
    return (
        <div className={styles.todo}>
          <ToDoAdd />
          <Card title="Todo List">
            {manager.collection.map((todo, index)=>(<ToDoItemView key={todo.id} todo={todo}/>))}
          </Card>
        </div>
    );
};

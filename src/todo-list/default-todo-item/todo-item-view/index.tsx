import React from 'react';
import { Checkbox, Tooltip, Tag, Icon, List, Button } from "antd";
import { DefaultToDoItem } from '../todo-item';
import { bindToArray, useInstance } from '@/molax/use';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ToDoManager } from '@/todo-list/manager';
import styles from './index.less';

export const ToDoItemView: React.FC<{todo:DefaultToDoItem}> = ({todo} ) => {
  const bindTodo=bindToArray(todo);
  const manager = useInstance<ToDoManager>(ToDoManager);
  return (
    <List.Item
      actions={[
        <Tooltip title="Remove Todo" key="remove">
          <Button type="danger" onClick={() => manager.remove(todo)}>
            <Icon type="delete" />
          </Button>
        </Tooltip>
      ]}
      className={styles.listItem}
    >
      <div className={styles.todoItem}>
        <Tooltip title={bindTodo.completed ? "Mark as uncompleted" : "Mark as completed"}>
          <Checkbox
            checked={bindTodo.completed}
            defaultChecked={bindTodo.completed}
            onChange={(e:CheckboxChangeEvent) => bindTodo.toggle(e.target.value)}
          />
        </Tooltip>

        <Tag color={todo.completed ? "green" : "volcano"} className={styles.todoTag}>
          {todo.completed ? <Icon type="check" /> : "-"}
        </Tag>

        <div className={styles.todoName}>
          {todo.completed ? <del>{bindTodo.name}</del> : bindTodo.name}
        </div>
      </div>
    </List.Item>
  );
};




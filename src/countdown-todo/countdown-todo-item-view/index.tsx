import React from 'react';
import { Checkbox, Tooltip, Tag, Icon, List, Button, Progress } from "antd";
import { CountdownToDoItem } from '../countdown-todo-item';
import { bindToArray, useInstance } from '@/molax/use';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ToDoManager } from '@/todo-list/manager';
import styles from './index.less';

export const CountdownToDoItemView: React.FC<{todo:CountdownToDoItem}> = ({todo} ) => {
  const bindTodo=bindToArray(todo);
  const manager = useInstance<ToDoManager>(ToDoManager);
  const percent = parseFloat((bindTodo.delta*100/bindTodo.deadLine).toFixed(2));
  let status: "active" | "success" | "exception"  = 'active';
  if(bindTodo.failed) {
    status = 'exception';
  }
  if(bindTodo.completed) {
    status = 'success';
  }
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
        <div className={styles.progress}>
          <Progress percent={percent} status={status} />
        </div>
      </div>
    </List.Item>
  );
};




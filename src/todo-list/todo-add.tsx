import React from "react";
import { Form, Icon, Input } from "antd";
import { FormComponentProps } from 'antd/lib/form';
import { ToDoManager } from './manager';
import { useInstance } from '@/molax/use';

interface IProps extends FormComponentProps<{name:string}> {

}

const TodoAdd = (props:IProps) => {
  const manager = useInstance<ToDoManager>(ToDoManager);
  const { form } = props;
  const { getFieldDecorator } = form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    form.validateFields((err, todo) => {
      if (!err) {
        form.resetFields();
        manager.add(todo.name)
      }
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      layout="horizontal"
    >
      <Form.Item>
        {getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "Please type in the todo name."
            }
          ]
        })(
          <Input
            prefix={<Icon type="tags" className="icon" />}
            placeholder="What needs to be done?"
            spellCheck={false}
            autoComplete={undefined}
            autoFocus={true}
          />
        )}
      </Form.Item>
    </Form>
  );
};

export default Form.create()(TodoAdd);

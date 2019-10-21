import React from "react";
import { Form, Icon, Input, Select } from "antd";
import { FormComponentProps } from 'antd/lib/form';
import { ToDoManager } from './manager';
import { useInstance } from '@/molax/use';

interface IProps extends FormComponentProps<{name:string, type:string}> {

}

const TodoAdd = (props:IProps) => {
  const manager = useInstance<ToDoManager>(ToDoManager);
  const { form } = props;
  const { getFieldDecorator } = form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    form.validateFields((err, todo) => {
      if (!err) {
        form.resetFields(['name']);
        manager.add(todo.type, todo.name)
      }
    });
  };
  const selectAfter = (
    getFieldDecorator("type", {
      rules: [
        {
          required: true,
          message: "Please select type"
        }
      ]
    })(
      <Select style={{ width: 80 }}>
        {
          manager.getProviders().map(provider=>(
            <Select.Option key={provider.type} value={provider.type}>{provider.title}</Select.Option>
          ))
        }
      </Select>
    )
  );
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
            addonAfter={selectAfter}
          />
        )}
      </Form.Item>
    </Form>
  );
};

export default Form.create()(TodoAdd);

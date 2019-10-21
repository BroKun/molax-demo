import { injectable, inject } from 'inversify';
import { ToDoItemContribution, ToDoItemRegistry, ToDoItemFactory, ToDoItem } from '../todo-item-registry';
import { ToDoItemView } from './todo-item-view';

export const DefaultToDoFactory = Symbol("DefaultToDoFactory");
const DefaultToDoItemType = 'default';

@injectable()
export class DefaultToDoItemContribution implements ToDoItemContribution {
  @inject(DefaultToDoFactory) protected readonly todoFactory: ToDoItemFactory;
  registerTodoItems(registry: ToDoItemRegistry): void {
    registry.registerItem({
      type: DefaultToDoItemType,
      title: '默认',
      provide: this.todoFactory,
      render: ToDoItemView,
      canRender: (todo: ToDoItem) => 200,
    })
  }
}

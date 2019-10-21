import { injectable, inject } from 'inversify';
import { ToDoItemContribution, ToDoItemRegistry, ToDoItemFactory, ToDoItem } from '../todo-item-registry';
import { ToDoItemView } from './todo-item-view';

export const DefaultToDoFactory = Symbol("DefaultToDoFactory");
const DefaultToDoItemType = 'default';

@injectable()
export class DefaultToDoItemContribution implements ToDoItemContribution {
  @inject(DefaultToDoFactory) protected readonly toolbarShareFactory: ToDoItemFactory;
  registerTodoItems(registry: ToDoItemRegistry): void {
    registry.registerItem({
      type: DefaultToDoItemType,
      title: '默认',
      provide: this.toolbarShareFactory,
      render: ToDoItemView,
      canRender: (todo: ToDoItem) => 200,
    })
  }
}

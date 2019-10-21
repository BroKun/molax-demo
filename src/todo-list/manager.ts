import { inject, injectable } from "inversify";
import { prop } from '@/molax/observable';
import { ToDoItemRegistry, ToDoItem, ToDoItemProvider } from './todo-item-registry';

@injectable()
export class ToDoManager {

  @prop()
  collection: ToDoItem[] = [];

  @inject(ToDoItemRegistry) protected todoRegistry: ToDoItemRegistry;

  get count (): number {
    return this.collection.length;
  }

  // tslint:disable-next-line:no-any
  public add(type:string, name:string, ...args:any[]): void {
    const provider = this.todoRegistry.getToDoItemProvider(type);
    if(!provider) {
      console.log(`没有找到${type}类型的ToDoItem注册信息，无法创建该类型的数据`)
      return;
    }
    const newToDo = provider.provide(name, ...args);
    this.collection.push(newToDo);
  }

  public remove(item:ToDoItem):void {
    this.collection = this.collection.filter(todo=>todo!==item)
  }
  public getRender(item: ToDoItem): React.FC<{todo: ToDoItem}> {
    return this.todoRegistry.getRender(item);
  }

  public getProviders(): ToDoItemProvider[] {
    return Array.from(this.todoRegistry.toDoItemProviderItems.values());
  }
}

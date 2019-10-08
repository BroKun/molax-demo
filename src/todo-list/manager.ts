import { inject, injectable } from "inversify";
import { prop } from '@/molax/observable';
import { ToDoItem, ToDoFactory } from "./todo-item";

@injectable()
export class ToDoManager {

  @prop()
  collection: ToDoItem[] = [];

  @inject(ToDoFactory) protected todoFactory: (name: string) => ToDoItem;

  get count (): number {
    return this.collection.length;
  }

  public add(name:string): void {
    const newToDo = this.todoFactory(name);
    this.collection.push(newToDo);
  }
  public remove(item:ToDoItem):void {
    this.collection = this.collection.filter(todo=>todo!==item)
  }
}

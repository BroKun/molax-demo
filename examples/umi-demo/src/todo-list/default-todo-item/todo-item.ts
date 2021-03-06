import { inject, injectable } from "inversify";
import { prop } from 'molax/lib/observable';
import uuid from 'uuid/v4'
import { ToDoItem } from '../todo-item-registry';

export const ToDoName = Symbol("ToDoName");
export const defaultToDoName = "默认";

@injectable()
export class DefaultToDoItem implements ToDoItem {
    public id: string = uuid();
    @prop()
    public completed: boolean = false;
    @inject(ToDoName) name: string;
    constructor () {
      console.log('DefaultToDoItem, constructor')
    }
    public toggle(value?:boolean): void {
      if(value===undefined) {
        this.completed = !this.completed;
      } else {
        this.completed= value;
      }
    }
}

import { inject, injectable } from "inversify";
import { prop } from '@/molax/observable';
import uuid from 'uuid/v4'

export const ToDoFactory = Symbol("ToDoFactory");
export const ToDoName = Symbol("ToDoName");
export const defaultToDoName = "默认";

export interface ToDoItem {
    id: string;
    name: string;
    completed: boolean;
    toggle: (value?:boolean) => void;
}

@injectable()
export class DefaultToDoItem implements ToDoItem {
    public id: string = uuid();
    @prop()
    public completed: boolean = false;
    @inject(ToDoName) name: string;

    public toggle(value?:boolean): void {
      if(value===undefined) {
        this.completed = !this.completed;
      } else {
        this.completed= value;
      }
    }
}

import { inject, injectable, postConstruct } from "inversify";
import { prop } from "molax/lib/observable";
import {
  DefaultToDoItem,
  ToDoName
} from "../todo-list/default-todo-item/todo-item";

@injectable()
export class CountdownToDoItem extends DefaultToDoItem {
  @prop() public outdated: boolean = false;
  @prop() public deadLine: number = 60;
  @prop() public delta: number = 0;
  @inject(ToDoName) name: string;

  protected timer: number;
  @postConstruct()
  protected init(): void {
    this.timer = setInterval(this.progressToDeadline, 1000 / 3);
  }
  protected progressToDeadline = () => {
    if (!this.completed && !this.outdated) {
      this.delta += 1;
    }
    if (this.delta > this.deadLine) {
      this.outdated = true;
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  };
  public toggle(value?: boolean): void {
    if (value === undefined) {
      this.completed = !this.completed;
    } else {
      this.completed = value;
    }
  }

  public setDeadLine = (value: number): void => {
    this.deadLine = value;
  };
}

import { ContainerModule } from "inversify";
import { ToDoName } from "../todo-list/default-todo-item/todo-item";
import { ToDoItemContribution, ToDoItem } from '../todo-list/todo-item-registry';
import { CountdownToDoFactory, CountdownToDoItemContribution } from './countdown-todo-item-contribution';
import { CountdownToDoItem } from './countdown-todo-item';

export const CountdownToDoModule = new ContainerModule((bind)=>{
  bind(CountdownToDoFactory).toFactory<ToDoItem>(context => (name: string) => {
    const child = context.container.createChild();
    child.bind(ToDoName).toConstantValue(name);
    child.bind(CountdownToDoItem).toSelf().inSingletonScope();
    return child.get(CountdownToDoItem);
  });

  bind(CountdownToDoItemContribution).toSelf().inSingletonScope();
  bind(ToDoItemContribution).toService(CountdownToDoItemContribution);
})


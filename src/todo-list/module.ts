import { ContainerModule, interfaces } from "inversify";
import { defaultToDoName, ToDoName, ToDoItem, ToDoFactory, DefaultToDoItem } from "./todo-item";
import { ToDoManager } from "./manager";

export const ToDoModule = new ContainerModule((bind)=>{
  bind(ToDoName).toConstantValue(defaultToDoName);

  bind<interfaces.Factory<ToDoItem>>(ToDoFactory).toFactory<ToDoItem>(context => (name: string) => {
    const child = context.container.createChild();
    child.bind(ToDoName).toConstantValue(name);
    child.bind(DefaultToDoItem).toSelf().inSingletonScope();
    return child.get(DefaultToDoItem);
  });

  bind(ToDoManager).toSelf().inSingletonScope();
})


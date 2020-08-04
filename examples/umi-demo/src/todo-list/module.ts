import { ContainerModule } from "inversify";
import { defaultToDoName, ToDoName, DefaultToDoItem } from "./default-todo-item/todo-item";
import { ToDoManager } from "./manager";
import { bindContributionProvider } from 'molax-app/lib/contribution';
import { ToDoItemContribution, ToDoItemRegistry, ToDoItem } from './todo-item-registry';
import { ApplicationContribution } from 'molax-app/lib/application';
import { DefaultToDoFactory, DefaultToDoItemContribution } from './default-todo-item/default-todo-item-contribution';

export const ToDoModule = new ContainerModule((bind)=>{
  bind(ToDoName).toConstantValue(defaultToDoName);


  // 扩展 application
  bind(ToDoItemRegistry).toSelf().inSingletonScope();
  bind(ApplicationContribution).toService(ToDoItemRegistry)

  // 注册扩展点
  bindContributionProvider(bind, ToDoItemContribution);

  bind(DefaultToDoFactory).toFactory<ToDoItem>(context => (name: string) => {
    const child = context.container.createChild();
    child.bind(ToDoName).toConstantValue(name);
    child.bind(DefaultToDoItem).toSelf().inSingletonScope();
    return child.get(DefaultToDoItem);
  });

  bind(DefaultToDoItemContribution).toSelf().inSingletonScope();
  bind(ToDoItemContribution).toService(DefaultToDoItemContribution);

  bind(ToDoManager).toSelf().inSingletonScope();

})


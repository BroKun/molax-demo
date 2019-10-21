import "reflect-metadata";
import { Container } from "inversify";
import { ToDoModule  } from '@/todo-list/module';
import { CoreModule } from './core/module';
import { CountdownToDoModule } from './countdown-todo/module';
import { Application } from './core/application';

export const container = new Container();
container.load(CoreModule);
container.load(ToDoModule);
container.load(CountdownToDoModule);

const app = container.get(Application);
app.printInfo();

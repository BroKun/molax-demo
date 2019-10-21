import "reflect-metadata";
import { Container } from "inversify";
import { ToDoModule  } from '@/todo-list/module';
import { CoreModule } from './core/module';
import { Application } from './core/application';

export const container = new Container();
container.load(CoreModule);
container.load(ToDoModule);

const app = container.get(Application);
app.printInfo();

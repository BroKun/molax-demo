import "reflect-metadata";
import 'molax/lib/use';
import { Container } from "inversify";
import { ToDoModule  } from '@/todo-list/module';
import { CoreModule } from 'molax-app/lib/module';
import { CountdownToDoModule } from './countdown-todo/module';
import { Application } from 'molax-app/lib/application';
import { CounterModule } from './counter/module';
import 'antd/dist/antd.less'

export const container = new Container();
container.load(CoreModule);
container.load(ToDoModule);
container.load(CountdownToDoModule);
container.load(CounterModule);

const app = container.get(Application);
app.printInfo();

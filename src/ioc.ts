import "reflect-metadata";
import { Container } from "inversify";
import { ToDoModule  } from './todo-list/module';

export const container = new Container();
container.load(ToDoModule);

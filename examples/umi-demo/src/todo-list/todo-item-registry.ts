import { injectable, inject, named } from 'inversify';
import { ContributionProvider } from 'molax-app/lib/contribution';
import { Disposable } from 'molax-app/lib/disposable';
import { ApplicationContribution } from 'molax-app/lib/application';

export interface ToDoItem {
  id: string;
  name: string;
  completed: boolean;
  toggle: (value?:boolean) => void;
}

export const ToDoItemFactory = Symbol('ToDoItemFactory');
export interface ToDoItemFactory {
  // tslint:disable-next-line:no-any
  (name:string, ...args:any[]):ToDoItem;
}
export const ToDoItemContribution = Symbol('ToDoItemContribution');
export interface ToDoItemContribution {
    registerTodoItems(registry: ToDoItemRegistry): void;
}
export interface ToDoItemProvider {
  readonly type: string;
  readonly title: string;
  provide: ToDoItemFactory;
  render: React.FC<{todo: ToDoItem}>;
  canRender:(item: ToDoItem)=>number;
}

@injectable()
export class ToDoItemRegistry implements ApplicationContribution {
    protected providers: Map<string, ToDoItemProvider> = new Map();

    @inject(ContributionProvider)
    @named(ToDoItemContribution)
    protected readonly contributionProvider: ContributionProvider<ToDoItemContribution>;

    async onStart(): Promise<void> {
      const contributions = this.contributionProvider.getContributions();
      for (const contribution of contributions) {
          contribution.registerTodoItems(this);
      }
    }

    registerItem(item: ToDoItemProvider): Disposable {
      const { type } = item;
      this.providers.set(type, item);
      return Disposable.create(() => this.providers.delete(type))
    }

    get toDoItemProviderItems(): Map<string, ToDoItemProvider> {
      return this.providers;
    }
    getToDoItemProvider(type:string): ToDoItemProvider | undefined  {
      return this.providers.get(type);
    }
    getRender(item: ToDoItem): React.FC<{todo: ToDoItem}> {
      const providers = Array.from<ToDoItemProvider>(this.providers.values())
      const sortted = providers.sort((p, p2)=>p2.canRender(item) - p.canRender(item))
      return sortted[0].render;
    }
}

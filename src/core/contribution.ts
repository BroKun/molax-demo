
// This file is inspired by Theia: /packages/core/src/common/contribution-provider.ts

import { interfaces } from 'inversify';
export const ContributionProvider = Symbol('ContributionProvider');
export interface ContributionProvider<T extends object> {
    /**
     * @param recursive if the contributions should be collected from the parent containers, `false` by default.
     */
    getContributions(recursive?: boolean): T[]
}
class DefaultContributionProvider<T extends object> implements ContributionProvider<T> {
    protected services: T[] | undefined;
    protected readonly serviceIdentifier: interfaces.ServiceIdentifier<T>;
    protected readonly container: interfaces.Container;
    constructor(serviceIdentifier: interfaces.ServiceIdentifier<T>,container: interfaces.Container) {
      this.container = container;
      this.serviceIdentifier = serviceIdentifier;
    }
    // 在使用时初始化 services 数据
    protected setServices(recursive?: boolean):T[] {
      const currentServices: T[] = [];
      let currentContainer: interfaces.Container | null = this.container;
      while (currentContainer !== null) {
          if (currentContainer.isBound(this.serviceIdentifier)) {
              try {
                  currentServices.push(...currentContainer.getAll(this.serviceIdentifier));
              } catch (error) {
                  console.error(error);
              }
          }
          currentContainer = recursive === true ? currentContainer.parent : null;
      }
      return currentServices;
    }
    getContributions(recursive?: boolean): T[] {
      if (this.services === undefined) {
        this.services = this.setServices(recursive);
      }
      return this.services;
    }
}

export type Bindable = interfaces.Bind | interfaces.Container;
export namespace Bindable {
  export function isContainer(arg: Bindable): arg is interfaces.Container {
      return typeof arg !== 'function' && ('guid' in arg || 'parent' in arg);
  }
}

export function bindContributionProvider<T extends object>(bindable: Bindable, providerIdentifier: symbol): void {
  let bindingToSyntax: interfaces.BindingToSyntax<ContributionProvider<T>>;
  if(Bindable.isContainer(bindable)) {
    bindingToSyntax = bindable.bind(ContributionProvider);
  } else {
    bindingToSyntax = bindable(ContributionProvider)
  }
  bindingToSyntax.toDynamicValue(ctx =>
    new DefaultContributionProvider<T>(providerIdentifier, ctx.container)
  ).inSingletonScope().whenTargetNamed(providerIdentifier);
}

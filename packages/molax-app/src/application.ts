import { injectable, inject, named, postConstruct } from 'inversify';
import { ContributionProvider } from './contribution';

export const ApplicationContribution = Symbol('ApplicationContribution');
export interface ApplicationContribution {
  onStart(app: Application): Promise<void>;
}

@injectable()
export class Application {
  @inject(ContributionProvider)
  @named(ApplicationContribution)
  protected readonly contributions: ContributionProvider<ApplicationContribution>;

  @postConstruct()
  protected async startApps(): Promise<void> {
    for (const contribution of this.contributions.getContributions()) {
      if (contribution.onStart) {
        try {
            await contribution.onStart(this)
        } catch (error) {
            console.log('应用启动失败:', contribution.constructor.name)
        }
      }
    }
  }
  printInfo():void {
    console.log('当前应用共：', this.contributions.getContributions.length);
  }
}

import { ContainerModule } from "inversify";

import { bindContributionProvider } from './contribution';
import { ApplicationContribution, Application } from './application';

export const CoreModule = new ContainerModule((bind)=>{
  bind(Application).toSelf().inSingletonScope();
  bindContributionProvider(bind, ApplicationContribution);
})


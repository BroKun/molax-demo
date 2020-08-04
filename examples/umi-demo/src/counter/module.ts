import { ContainerModule } from "inversify";
import { Counter } from './counter';

export const CounterModule = new ContainerModule((bind)=>{
  bind(Counter).toSelf().inSingletonScope();
})


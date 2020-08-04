import { injectable } from "inversify";
import { prop } from 'molax/lib/observable';

@injectable()
export class Counter {
  @prop()
  value: number = 0;

  constructor () {
    console.log('Counter, constructor')
  }
  public add(delta: number = 1): void {
    this.value+=delta;
  }
}

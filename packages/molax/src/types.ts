// tslint:disable: no-any
export namespace ReactiveSymbol {
  export const Trigger = Symbol("Trigger");
  export const Tracker = Symbol("PropertyTracker");
  export const TraceableProperty = Symbol("TraceableProperty");
  export const ObjectSelf = Symbol('ObjectSelf');
}

export type Reaction = (target?: any, prop?: any)=>void;

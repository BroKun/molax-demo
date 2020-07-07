export interface Disposable {
  /**
   * Dispose this object.
   */
  dispose(): void;
}
export namespace Disposable {
  // tslint:disable-next-line:no-any
  export function is(arg: any): arg is Disposable {
      return !!arg && typeof arg === 'object' && 'dispose' in arg && typeof arg['dispose'] === 'function';
  }
  export function create(func: () => void): Disposable {
      return {
          dispose: func
      };
  }
}

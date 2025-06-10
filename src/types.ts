export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type PublicProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

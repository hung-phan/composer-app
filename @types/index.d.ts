declare module "http" {
  export class MicroIncomingMessage extends IncomingMessage {
    public params: { readonly [key: string]: string };
    public query: { readonly [key: string]: string };
  }
}

export type Clazz<T> = new (...args: unknown[]) => T;

import { requestType } from '../requestType';

export interface IHTTPServerRouterManager {
  addRoute(path: string, reqType: requestType, handler: any, options: object): any;

  setRouter(router: any): void;
}

export abstract class AbstractHTTPServerRouterManager<T> implements IHTTPServerRouterManager {
  protected readonly baseUrlPath: string;
  protected readonly basePath: string;

  protected constructor(baseUrlPath: string, basePath: string) {
    this.baseUrlPath = baseUrlPath;
    this.basePath = basePath;
  }

  /* c8 ignore start */
  public addRoute(_path: string, _reqType: requestType, _handler: T, _options: object): any {
    throw new Error('Must be implemented in children');
  }

  /* c8 ignore end */

  public abstract setRouter(router: any): void;
}

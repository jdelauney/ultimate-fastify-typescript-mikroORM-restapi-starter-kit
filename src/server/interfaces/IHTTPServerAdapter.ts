export interface IHTTPServerAdapter {
  getServerInstance: () => any;
  start: () => Promise<void>;
  stop: () => void;
  //Create: ({ baseUrl, opts = {} }: { baseUrl: string; opts?: object }) => Promise<unknown>;
}

export abstract class AbstractHTTPServerAdapter implements IHTTPServerAdapter {
  protected baseUrl: string;
  protected options: object = {};

  protected constructor(baseUrl: string, options = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      ...options,
    };
  }

  abstract getServerInstance(): any;

  protected abstract initialize(): void;

  protected abstract initPlugins(): void;

  public abstract start(): Promise<void>;

  public abstract stop(): void;

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

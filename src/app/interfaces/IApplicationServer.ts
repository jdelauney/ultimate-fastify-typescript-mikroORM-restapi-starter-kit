import { ControllerRoute, ControllerRoutes, IHTTPServerController } from '../../server/interfaces/IHTTPServerController';
import { IHTTPServerAdapter } from '../../server/interfaces/IHTTPServerAdapter';
import { IHTTPServerRouterManager } from '../../server/interfaces/IHTTPServerRouterManager';

export interface IApplicationServer {
  run: () => Promise<void>;
  stop: () => void;
  getServerInstance: () => unknown;
}

export type ControllerList = IHTTPServerController[];

export abstract class AbstractApplicationServer implements IApplicationServer {
  private readonly serverAdapter: IHTTPServerAdapter;
  private readonly routerManager: IHTTPServerRouterManager;
  private readonly controllers: ControllerList;

  protected constructor(serverAdapter: IHTTPServerAdapter, routerManager: IHTTPServerRouterManager, controllers: ControllerList) {
    this.serverAdapter = serverAdapter;
    this.routerManager = routerManager;
    this.routerManager.setRouter(this.serverAdapter.getServerInstance());
    this.controllers = controllers;
  }

  protected async initializeRoutes(): Promise<void> {
    for (const controller of this.controllers) {
      const routes: ControllerRoutes = (controller as IHTTPServerController).getRoutes();
      for (const route of routes) {
        const routedef: ControllerRoute = route as ControllerRoute;
        await this.routerManager.addRoute(routedef.path, routedef.method, routedef.handler, routedef.options);
      }
    }
  }

  protected getServerAdapter(): IHTTPServerAdapter {
    return this.serverAdapter;
  }

  public abstract getServerInstance(): unknown;

  public async run(): Promise<void> {
    return await this.serverAdapter.start();
  }

  public stop(): void {
    this.serverAdapter.stop();
  }
}

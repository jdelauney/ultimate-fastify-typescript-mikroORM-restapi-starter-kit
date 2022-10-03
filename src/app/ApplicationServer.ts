import { AbstractApplicationServer, ControllerList } from './interfaces/IApplicationServer';
import { IHTTPServerAdapter } from '../server/interfaces/IHTTPServerAdapter';
import { IHTTPServerRouterManager } from '../server/interfaces/IHTTPServerRouterManager';
import { FastifyInstance } from 'fastify';

export default class ApplicationServer extends AbstractApplicationServer {
  public constructor(serverAdapter: IHTTPServerAdapter, routerManager: IHTTPServerRouterManager, controllers: ControllerList) {
    super(serverAdapter, routerManager, controllers);
  }

  public static async Create(
    serverAdapter: IHTTPServerAdapter,
    routerManager: IHTTPServerRouterManager,
    controllers: ControllerList,
  ): Promise<ApplicationServer> {
    const instance: ApplicationServer = new ApplicationServer(serverAdapter, routerManager, controllers);
    await instance.initializeRoutes();
    return Promise.resolve(instance);
  }

  public getServerInstance(): FastifyInstance {
    return this.getServerAdapter().getServerInstance();
  }
}

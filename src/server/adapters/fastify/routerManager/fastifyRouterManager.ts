import { AbstractHTTPServerRouterManager } from '../../../interfaces/IHTTPServerRouterManager';
import { FastifyInstance, RouteHandlerMethod } from 'fastify';
import { requestType } from '../../../requestType';

// export type FastifyServerRouteHandler = (req: FastifyRequest, res: FastifyReply) => any;

export default class FastifyRouterManager extends AbstractHTTPServerRouterManager<RouteHandlerMethod> {
  private instance: FastifyInstance | undefined;

  public constructor(baseUrl: string, basePath: string) {
    super(baseUrl, basePath);
    this.instance = undefined;
  }

  setRouter(router: FastifyInstance): void {
    this.instance = router;
  }

  public async addRoute(path: string, reqType: requestType, handler: RouteHandlerMethod, options: object): Promise<any> {
    if (this.instance === undefined) {
      throw new Error('You must define a router');
    }
    const requestPath: string = this.baseUrlPath + this.basePath + path;
    switch (reqType) {
      case requestType.REQUEST_GET:
        await this.instance.get(requestPath, options, handler);
        break;
      case requestType.REQUEST_POST:
        await this.instance.post(requestPath, options, handler);
        break;
      case requestType.REQUEST_UPDATE:
        await this.instance.put(requestPath, options, handler);
        break;
      case requestType.REQUEST_PATCH:
        await this.instance.patch(requestPath, options, handler);
        break;
      case requestType.REQUEST_DELETE:
        await this.instance.delete(requestPath, options, handler);
        break;
    }
  }
}

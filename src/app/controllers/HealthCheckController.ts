import { ControllerRoutes, IHTTPServerController } from '../../server/interfaces/IHTTPServerController';
import { requestType } from '../../server/requestType';

export default class HealthCheckController implements IHTTPServerController {
  protected async index(): Promise<any> {
    return {
      message: 'Server health check is ok',
    };
  }

  public getRoutes(): ControllerRoutes {
    return [
      {
        path: '/healthcheck',
        method: requestType.REQUEST_GET,
        options: {},
        handler: this.index,
      },
    ];
  }
}

import { requestType } from '../requestType';

export type ControllerRoute = {
  path: string;
  method: requestType;
  options: object;
  handler: any;
};

export type ControllerRoutes = ControllerRoute[];

export interface IHTTPServerController {
  getRoutes: () => ControllerRoutes;
}

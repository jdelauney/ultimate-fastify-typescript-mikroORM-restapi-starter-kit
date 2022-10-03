import { beforeAll, describe, expect, test } from 'vitest';
import HealthCheckController from '../app/controllers/HealthCheckController';
import { ControllerRoutes } from '../server/interfaces/IHTTPServerController';
import { requestType } from '../server/requestType';

//dotenv.config();

let healthCheckController: HealthCheckController;

describe('Feature : HealthCheck Controller', () => {
  beforeAll(async () => {
    healthCheckController = new HealthCheckController();
  });

  describe('Given a HealthCheckController', () => {
    describe('When we call index method', () => {
      test("Then it Should return { message: 'Server health check is ok' } ", async () => {
        const proto = Object.getPrototypeOf(healthCheckController);
        const response = await proto.index();
        expect(response).toStrictEqual({ message: 'Server health check is ok' });
      });
    });
    describe('When we call getRoutes method', () => {
      test('Then it Should return all available routes', async () => {
        const response: ControllerRoutes = healthCheckController.getRoutes();
        const proto = Object.getPrototypeOf(healthCheckController);
        expect(response).toStrictEqual([
          {
            path: '/healthcheck',
            method: requestType.REQUEST_GET,
            options: {},
            handler: proto.index,
          },
        ]);
      });
    });
  });
});

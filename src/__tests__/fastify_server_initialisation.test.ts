import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import supertest from 'supertest';
import FastifyServerAdapter from '../server/adapters/fastify/server/fastifyServerAdapter';
import FastifyRouterManager from '../server/adapters/fastify/routerManager/fastifyRouterManager';
import HealthCheckController from '../app/controllers/HealthCheckController';
import { ControllerRoutes } from '../server/interfaces/IHTTPServerController';

let fastifyServer: FastifyServerAdapter;
let fastifyRouter: FastifyRouterManager;
let healthCheckController: HealthCheckController;

describe('Feature : Fastify server', () => {
  beforeAll(async () => {
    fastifyServer = await FastifyServerAdapter.Create({ baseUrl: '/api' });
    fastifyRouter = new FastifyRouterManager(fastifyServer.getBaseUrl(), '');
    healthCheckController = new HealthCheckController();
    const healthCheckRoutes: ControllerRoutes = healthCheckController.getRoutes();
    fastifyRouter.setRouter(fastifyServer.getServerInstance());
    await fastifyRouter.addRoute(healthCheckRoutes[0].path, healthCheckRoutes[0].method, healthCheckRoutes[0].handler, healthCheckRoutes[0].options);
    await fastifyServer.start();
  });

  describe('Given a Fastify Server Class ', () => {
    describe('When we request : /api/healthcheck', () => {
      test('Then it Should return response status code : 200', async () => {
        const response = await supertest(fastifyServer.getServerInstance().server).get('/api/healthcheck');
        expect(response.statusCode).toBe(200);
      });

      test('Then it Should return content-type : json with utf-8', async () => {
        const response = await supertest(fastifyServer.getServerInstance().server).get('/api/healthcheck');
        expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
      });

      test("Then it Should return response as json : { message: 'Server health check is ok' }", async () => {
        const response = await supertest(fastifyServer.getServerInstance().server).get('/api/healthcheck');
        expect(response.body).toStrictEqual({ message: 'Server health check is ok' });
      });
    });
    describe('When we request a bad url : /notexist', () => {
      test('Then it Should return response status code : 404', async () => {
        const response = await supertest(fastifyServer.getServerInstance().server).get('/notexist');
        expect(response.statusCode).toBe(404);
      });
      test("Then it Should return response as json : { error: 'Not Found', message: 'Route GET:/notexist not found', statusCode: 404 }", async () => {
        const response = await supertest(fastifyServer.getServerInstance().server).get('/notexist');
        expect(response.body).toStrictEqual({
          error: 'Not Found',
          message: 'Route GET:/notexist not found',
          statusCode: 404,
        });
      });
    });
  });
  afterAll(async () => {
    await fastifyServer.stop();
  });
});

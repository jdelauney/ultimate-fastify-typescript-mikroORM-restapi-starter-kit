import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import supertest from 'supertest';
import FastifyServerAdapter from '../server/adapters/fastify/server/fastifyServerAdapter';
import FastifyRouterManager from '../server/adapters/fastify/routerManager/fastifyRouterManager';
import HealthCheckController from '../app/controllers/HealthCheckController';
import ApplicationServer from '../app/ApplicationServer';
import * as dotenv from 'dotenv';
import path from 'path';

let Application: ApplicationServer;

const initServer = async () => {
  const result = await dotenv.config({
    path: path.resolve(__dirname, '.env.test'),
  });

  if (result.error) {
    //console.log(result.error);
    throw result.error;
  }

  //console.log(result.parsed);

  const baseAPIUrl = '/api';
  const fastifyServer = await FastifyServerAdapter.Create({
    baseUrl: baseAPIUrl,
    /*options: {
      logger: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
        },
      },
    },*/
  });
  Application = await ApplicationServer.Create(fastifyServer, new FastifyRouterManager(baseAPIUrl, ''), [new HealthCheckController()]);
};
describe('Feature : Application end-point', () => {
  beforeAll(async () => {
    await initServer();
    await Application.run();
  });

  describe('Given the Application ', () => {
    describe('When we request : /api/healthcheck', () => {
      test('Then it Should return response status code : 200', async () => {
        const response = await supertest(Application.getServerInstance().server).get('/api/healthcheck');
        expect(response.statusCode).toBe(200);
      });

      test('Then it Should return content-type : json with utf-8', async () => {
        const response = await supertest(Application.getServerInstance().server).get('/api/healthcheck');
        expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
      });

      test("Then it Should return response as json : { message: 'Server health check is ok' }", async () => {
        const response = await supertest(Application.getServerInstance().server).get('/api/healthcheck');
        expect(response.body).toStrictEqual({ message: 'Server health check is ok' });
      });
    });
    describe('When we request a bad url : /notexist', () => {
      test('Then it Should return response status code : 404', async () => {
        const response = await supertest(Application.getServerInstance().server).get('/notexist');
        expect(response.statusCode).toBe(404);
      });

      test("Then it Should return response as json : { error: 'Not Found', message: 'Route GET:/notexist not found', statusCode: 404 }", async () => {
        const response = await supertest(Application.getServerInstance().server).get('/notexist');
        expect(response.body).toStrictEqual({
          error: 'Not Found',
          message: 'Route GET:/notexist not found',
          statusCode: 404,
        });
      });
    });
  });
  afterAll(async () => {
    await Application.stop();
  });
});

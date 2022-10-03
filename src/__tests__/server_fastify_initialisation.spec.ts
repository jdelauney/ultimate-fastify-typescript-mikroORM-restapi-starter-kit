import { beforeAll, describe, expect, test } from 'vitest';
import fastify, { FastifyInstance } from 'fastify';

const buildFastifyServer = (baseUrl = 'api/', opts = {}): FastifyInstance => {
  const app = fastify(opts);
  app.get('/' + baseUrl + 'healthcheck', async () => {
    return { hello: 'world' };
  });
  return app;
};

const app: FastifyInstance = buildFastifyServer(
  'api/',
  {} /*{
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
}*/,
);

describe('Feature : Application Server spec', () => {
  beforeAll(async () => {
    await app.listen({ port: 3000 }, err => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    });
    await app.ready();
  });

  describe('Given a Fastify Server Application ', () => {
    describe('When request : /api/healthcheck', () => {
      test('Then it Should return response status code : 200', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/healthcheck',
        });
        expect(response.statusCode).toBe(200);
      });

      test('Then it Should return content-type : json with utf-8', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/healthcheck',
        });
        expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
      });

      test('Then it Should return response as json : { hello: "world" } ', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/healthcheck',
        });
        expect(response.json()).toStrictEqual({ hello: 'world' });
      });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});

import ApplicationServer from './app/ApplicationServer';
import FastifyServerAdapter from './server/adapters/fastify/server/fastifyServerAdapter';
import FastifyRouterManager from './server/adapters/fastify/routerManager/fastifyRouterManager';
import HealthCheckController from './app/controllers/HealthCheckController';
import * as dotenv from 'dotenv';
import path from 'path';

(async () => {
  const result = await dotenv.config({
    path: path.resolve(__dirname, '.env'),
  });

  if (result.error) {
    throw result.error;
  }
  const baseAPIUrl = '/api';
  const fastifyServer = await FastifyServerAdapter.Create({ baseUrl: baseAPIUrl });
  const Application: ApplicationServer = await ApplicationServer.Create(fastifyServer, new FastifyRouterManager(baseAPIUrl, ''), [new HealthCheckController()]);

  await Application.run();
})();

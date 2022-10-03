import { AbstractHTTPServerAdapter } from '../../../interfaces/IHTTPServerAdapter';
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import helmet from '@fastify/helmet';
import rateLimiter from '@fastify/rate-limit';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import sensible from '@fastify/sensible';
import formbody from '@fastify/formbody';
import gracefulShutdown from 'fastify-graceful-shutdown';

import { loadEnvironmentVariable } from '../../../../core/utils/configurationHelper';

export default class FastifyServerAdapter extends AbstractHTTPServerAdapter {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private fastify: FastifyInstance;
  private readonly defaultPort = 3000;
  private readonly port: number;

  public constructor(baseUrl: string, opts = {}) {
    super(baseUrl, {
      logger: {
        level: 'info',
        /*transport: {
          target: 'pino-pretty',
        },*/
      },
      ...opts,
    });
    const envPort: string | undefined = loadEnvironmentVariable('SERVER_PORT');
    this.port = envPort === undefined ? this.defaultPort : Number(envPort);
  }

  public static async Create({ baseUrl, opts = {} }: { baseUrl: string; opts?: object }): Promise<FastifyServerAdapter> {
    const instance: FastifyServerAdapter = new FastifyServerAdapter(baseUrl, opts);
    await instance.initialize();
    await instance.initPlugins();
    return Promise.resolve(instance);
  }

  protected async initialize(): Promise<void> {
    this.fastify = await Fastify(this.options);
    /*  await this.fastify.get('/' + this.baseUrl + 'healthcheck', async () => {
        return { hello: 'world' };
      });*/
    //this.initAuth() https://github.com/fastify/fastify-auth
  }

  protected async initPlugins(): Promise<void> {
    await this.fastify.register(helmet, { global: true });
    await this.fastify.register(rateLimiter, { max: 100, timeWindow: '1 minute' });
    await this.fastify.register(cors, () => {
      return (req: FastifyRequest, callback) => {
        const corsOptions = {
          // This is NOT recommended for production as it enables reflection exploits
          origin: true,
        };
        /* c8 ignore start */
        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(<string>req.headers.origin)) {
          corsOptions.origin = false;
        }
        /* c8 ignore end */
        // callback expects two parameters: error and options
        callback(null, corsOptions);
      };
    });
    await this.fastify.register(sensible);
    await this.fastify.register(formbody);
    await this.fastify.register(gracefulShutdown);
    await this.fastify.after(() => {
      this.fastify.gracefulShutdown((_signal, next) => {
        console.log('Upps!');
        next();
      });
    });
    await this.fastify.register(swagger, {
      routePrefix: '/swagger',
      swagger: {
        info: {
          title: 'Server Fastify API documentation',
          description: 'RestAPI documentation',
          version: '0.1.0',
        },
        host: 'localhost:' + this.port.toString(),
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
      exposeRoute: true,
    });
  }

  public getServerInstance(): FastifyInstance {
    return this.fastify;
  }

  public async start(): Promise<void> {
    try {
      await this.fastify.listen({ port: this.port });
      await this.fastify.ready();
      this.fastify.swagger();
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }

  public async stop() {
    await this.fastify.close();
  }
}

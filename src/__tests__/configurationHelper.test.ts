import { beforeAll, describe, expect, test } from 'vitest';
import { loadEnvironmentVariable } from '../core/utils/configurationHelper';
import * as dotenv from 'dotenv';
import path from 'path';

describe('Feature : loadEnvironmentVariable', () => {
  beforeAll(async () => {
    const result = await dotenv.config({
      path: path.resolve(__dirname, '.env.test'),
    });

    if (result.error) {
      throw result.error;
    }
  });

  describe('Given configurationHelper unit ', () => {
    describe('When we call loadEnvironmentVariable() with existing environnement variable SERVER_PORT as string parameter', () => {
      test('Then it Should return a typeof string', async () => {
        const response = loadEnvironmentVariable('SERVER_PORT');
        expect(typeof response).toBe('string');
      });
      test('Then it Should return value 3000 as Number', async () => {
        const response: string | number | boolean | undefined = loadEnvironmentVariable('SERVER_PORT');
        expect(Number(response)).toEqual(3000);
      });
    });
    describe('When we call loadEnvironmentVariable() with no existing environnement variable NOT_EXIST as string parameter', () => {
      test('Then it Should return undefined', async () => {
        const response: string | number | boolean | undefined = loadEnvironmentVariable('NOT_EXIST');
        expect(typeof response).toBe('undefined');
      });
    });
  });
});

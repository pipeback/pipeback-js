import { describe, it, expectTypeOf, expect } from 'vitest';
import type {
  PipebackConfig,
  PipebackInstance
} from '../src/index';

// Test both import styles
import PipebackDefault from '../src/index';
import { Pipeback as PipebackNamed } from '../src/index';

describe('Type definitions', () => {
  it('should support default import', () => {
    expect(PipebackDefault).toBeDefined();
    expect(typeof PipebackDefault).toBe('function');
  });

  it('should support named import', () => {
    expect(PipebackNamed).toBeDefined();
    expect(typeof PipebackNamed).toBe('function');
  });

  it('should be the same function for both imports', () => {
    expect(PipebackDefault).toBe(PipebackNamed);
  });
  it('should have correct PipebackConfig type', () => {
    const config: PipebackConfig = {
      workspaceId: 'test-workspace',
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com'
      }
    };
    expectTypeOf(config).toMatchTypeOf<PipebackConfig>();
  });

  it('should have correct PipebackInstance type with all methods', () => {
    const instance = {} as PipebackInstance;

    expectTypeOf(instance.init).toBeFunction();
    expectTypeOf(instance.init).returns.toMatchTypeOf<Promise<void>>();
    expectTypeOf(instance.isReady).toBeFunction();
    expectTypeOf(instance.isReady).returns.toMatchTypeOf<boolean>();
    expectTypeOf(instance.open).toBeFunction();
    expectTypeOf(instance.close).toBeFunction();
    expectTypeOf(instance.show).toBeFunction();
    expectTypeOf(instance.hide).toBeFunction();
    expectTypeOf(instance.navigate).toBeFunction();
  });
});

import { describe, it, expectTypeOf } from 'vitest';
import type {
  PipebackConfig,
  PipebackUser,
  PipebackInstance,
  PipebackCallbacks,
  PipebackUserCompany,
  PipebackUserAttributes
} from '../src/types';

describe('Type definitions', () => {
  it('should have correct PipebackConfig type', () => {
    expectTypeOf<PipebackConfig>().toMatchTypeOf<{
      workspaceId: string;
      user?: PipebackUser;
      callbacks?: PipebackCallbacks;
      cdnUrl?: string;
    }>();
  });

  it('should have correct PipebackUser type', () => {
    expectTypeOf<PipebackUser>().toMatchTypeOf<{
      id: string;
      name: string;
      email: string;
      signature?: string;
      company?: PipebackUserCompany;
      attributes?: PipebackUserAttributes;
    }>();
  });

  it('should have correct PipebackInstance type', () => {
    const instance = {} as PipebackInstance;

    expectTypeOf(instance.init).toBeFunction();
    expectTypeOf(instance.init).returns.toMatchTypeOf<Promise<void>>();
    expectTypeOf(instance.isReady).toBeFunction();
    expectTypeOf(instance.isReady).returns.toMatchTypeOf<boolean>();
    expectTypeOf(instance.open).toBeFunction();
    expectTypeOf(instance.close).toBeFunction();
    expectTypeOf(instance.show).toBeFunction();
    expectTypeOf(instance.hide).toBeFunction();
  });

  it('should allow custom attributes with various types', () => {
    const attributes: PipebackUserAttributes = {
      plan: 'pro',
      monthly_spend: 5000,
      is_active: true,
      last_login: null,
      optional_field: undefined
    };

    expectTypeOf(attributes).toMatchTypeOf<PipebackUserAttributes>();
  });
});

import { describe, it, expect } from 'vitest';
import { parseHash, buildHash } from './router';

describe('parseHash', () => {
  it('returns empty route for empty hash', () => {
    expect(parseHash('')).toEqual({});
  });

  it('returns empty route for bare hash', () => {
    expect(parseHash('#')).toEqual({});
    expect(parseHash('#/')).toEqual({});
  });

  it('parses appId only', () => {
    expect(parseHash('#/sdmaid-se')).toEqual({ appId: 'sdmaid-se' });
  });

  it('parses appId and commandId', () => {
    expect(parseHash('#/sdmaid-se/grant-write-secure-settings')).toEqual({
      appId: 'sdmaid-se',
      commandId: 'grant-write-secure-settings',
    });
  });

  it('handles trailing slash', () => {
    expect(parseHash('#/sdmaid-se/')).toEqual({ appId: 'sdmaid-se' });
  });

  it('ignores extra path segments', () => {
    const result = parseHash('#/sdmaid-se/grant-write-secure-settings/extra');
    expect(result.appId).toBe('sdmaid-se');
    expect(result.commandId).toBe('grant-write-secure-settings');
  });
});

describe('buildHash', () => {
  it('builds empty hash', () => {
    expect(buildHash({})).toBe('#/');
  });

  it('builds app-only hash', () => {
    expect(buildHash({ appId: 'sdmaid-se' })).toBe('#/sdmaid-se');
  });

  it('builds full hash', () => {
    expect(buildHash({ appId: 'sdmaid-se', commandId: 'grant-write-secure-settings' }))
      .toBe('#/sdmaid-se/grant-write-secure-settings');
  });

  it('ignores commandId without appId', () => {
    expect(buildHash({ commandId: 'grant-write-secure-settings' })).toBe('#/');
  });
});

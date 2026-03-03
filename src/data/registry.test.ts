import { describe, it, expect } from 'vitest';
import { findApp, findCommand, apps } from './registry';

describe('registry', () => {
  it('has at least one app', () => {
    expect(apps.length).toBeGreaterThan(0);
  });

  it('finds sdmaid-se by id', () => {
    const app = findApp('sdmaid-se');
    expect(app).toBeDefined();
    expect(app!.name).toBe('SD Maid SE');
  });

  it('returns undefined for unknown app', () => {
    expect(findApp('nonexistent')).toBeUndefined();
  });

  it('finds a command by app and command id', () => {
    const result = findCommand('sdmaid-se', 'grant-write-secure-settings');
    expect(result).toBeDefined();
    expect(result!.command.title).toBe('Grant WRITE_SECURE_SETTINGS');
  });

  it('returns undefined for unknown command', () => {
    expect(findCommand('sdmaid-se', 'nonexistent')).toBeUndefined();
  });

  it('returns undefined for unknown app in findCommand', () => {
    expect(findCommand('nonexistent', 'grant-write-secure-settings')).toBeUndefined();
  });
});

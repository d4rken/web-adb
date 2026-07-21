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

  it('finds amply by id', () => {
    const app = findApp('amply');
    expect(app).toBeDefined();
    expect(app!.name).toBe('Amply');
    expect(app!.packageName).toBe('eu.darken.amply');
  });

  it('has unique app ids', () => {
    const ids = apps.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique command ids within each app', () => {
    for (const app of apps) {
      const ids = app.commands.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('references an i18n name/description key namespace per app', () => {
    // The UI renders app.<id>.name / .description, so every app needs a stable id.
    for (const app of apps) {
      expect(app.id).toMatch(/^[a-z0-9-]+$/);
    }
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

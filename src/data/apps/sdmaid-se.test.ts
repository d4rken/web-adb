import { describe, it, expect } from 'vitest';
import { sdmaidSe } from './sdmaid-se';

describe('sdmaid-se accessibility service command', () => {
  const cmd = sdmaidSe.commands.find((c) => c.id === 'enable-accessibility-service')!;

  it('has an execute function', () => {
    expect(cmd.execute).toBeDefined();
  });

  it('appends service to empty list', async () => {
    const calls: string[] = [];
    const run = async (c: string) => {
      calls.push(c);
      if (c.startsWith('settings get')) return 'null';
      return '';
    };

    const result = await cmd.execute!(run);
    expect(result).toContain('enabled');
    expect(calls).toHaveLength(2);
    expect(calls[1]).toContain('settings put');
    expect(calls[1]).toContain('eu.darken.sdmse/.automation.core.AutomationService');
  });

  it('appends service to existing list without overwriting', async () => {
    const existing = 'com.other/Service1:com.another/Service2';
    const calls: string[] = [];
    const run = async (c: string) => {
      calls.push(c);
      if (c.startsWith('settings get')) return existing;
      return '';
    };

    const result = await cmd.execute!(run);
    expect(result).toContain('enabled');
    // The put command should contain all three services
    const putCmd = calls.find((c) => c.startsWith('settings put'))!;
    expect(putCmd).toContain('com.other/Service1');
    expect(putCmd).toContain('com.another/Service2');
    expect(putCmd).toContain('eu.darken.sdmse/.automation.core.AutomationService');
  });

  it('does not duplicate if already present', async () => {
    const existing = 'eu.darken.sdmse/.automation.core.AutomationService';
    const calls: string[] = [];
    const run = async (c: string) => {
      calls.push(c);
      if (c.startsWith('settings get')) return existing;
      return '';
    };

    const result = await cmd.execute!(run);
    expect(result).toContain('already enabled');
    // Should NOT have a put command
    expect(calls).toHaveLength(1);
  });
});

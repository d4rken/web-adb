import { describe, it, expect } from 'vitest';
import { sdmaidSe } from './sdmaid-se';

const grantCmd = sdmaidSe.commands.find((c) => c.id === 'grant-write-secure-settings')!;
const revokeCmd = sdmaidSe.commands.find((c) => c.id === 'revoke-write-secure-settings')!;

function mockRun(response: string) {
  return async (cmd: string) => {
    void cmd;
    return response;
  };
}

describe('grant-write-secure-settings', () => {
  it('has correct pm grant command', () => {
    expect(grantCmd.command).toContain('pm grant');
    expect(grantCmd.command).toContain('WRITE_SECURE_SETTINGS');
  });

  it('skips when permission is already granted', async () => {
    const result = await grantCmd.check!(mockRun('android.permission.WRITE_SECURE_SETTINGS: granted=true'));
    expect(result.proceed).toBe(false);
  });

  it('proceeds when permission is not granted', async () => {
    const result = await grantCmd.check!(mockRun('android.permission.WRITE_SECURE_SETTINGS: granted=false'));
    expect(result.proceed).toBe(true);
  });

  it('proceeds when dumpsys returns empty output', async () => {
    const result = await grantCmd.check!(mockRun(''));
    expect(result.proceed).toBe(true);
  });
});

describe('revoke-write-secure-settings', () => {
  it('has correct pm revoke command', () => {
    expect(revokeCmd.command).toContain('pm revoke');
    expect(revokeCmd.command).toContain('WRITE_SECURE_SETTINGS');
  });

  it('skips when permission is already revoked', async () => {
    const result = await revokeCmd.check!(mockRun('android.permission.WRITE_SECURE_SETTINGS: granted=false'));
    expect(result.proceed).toBe(false);
  });

  it('proceeds when permission is currently granted', async () => {
    const result = await revokeCmd.check!(mockRun('android.permission.WRITE_SECURE_SETTINGS: granted=true'));
    expect(result.proceed).toBe(true);
  });

  it('skips when dumpsys returns empty output', async () => {
    const result = await revokeCmd.check!(mockRun(''));
    expect(result.proceed).toBe(false);
  });
});

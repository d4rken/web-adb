import { describe, it, expect } from 'vitest';
import { amply } from './amply';

const AMPLY_PKG = 'eu.darken.amply';
const WSS = 'android.permission.WRITE_SECURE_SETTINGS';

const grantCmd = amply.commands.find((c) => c.id === 'grant-write-secure-settings')!;
const revokeCmd = amply.commands.find((c) => c.id === 'revoke-write-secure-settings')!;

interface FakeState {
  installed: boolean;
  granted: boolean;
  /** When true, `pm grant` is a no-op so we can exercise the post-grant verification. */
  grantNoop?: boolean;
  /** When true, `pm revoke` is a no-op so we can exercise the post-revoke verification. */
  revokeNoop?: boolean;
}

function runner(state: FakeState) {
  return async (cmd: string): Promise<string> => {
    if (cmd.startsWith('pm list packages')) {
      return state.installed ? `package:${AMPLY_PKG}` : '';
    }
    if (cmd.startsWith('dumpsys package')) {
      if (!state.installed) return `Unable to find package: ${AMPLY_PKG}`;
      return [
        'Packages:',
        `  Package [${AMPLY_PKG}] (abc):`,
        '    User 0:',
        '      runtime permissions:',
        `        ${WSS}: granted=${state.granted ? 'true' : 'false'}`,
      ].join('\n');
    }
    if (cmd.startsWith('pm grant')) {
      if (!state.grantNoop) state.granted = true;
      return '';
    }
    if (cmd.startsWith('pm revoke')) {
      if (!state.revokeNoop) state.granted = false;
      return '';
    }
    return '';
  };
}

describe('amply metadata', () => {
  it('targets the Amply package (not a copied SD Maid id)', () => {
    expect(amply.id).toBe('amply');
    expect(amply.packageName).toBe(AMPLY_PKG);
  });

  it('marks the WSS grant/revoke as moderate risk', () => {
    expect(grantCmd.risk).toBe('moderate');
    expect(revokeCmd.risk).toBe('moderate');
  });
});

describe('amply grant-write-secure-settings', () => {
  it('uses the exact user-0 pm grant command for the Amply package', () => {
    expect(grantCmd.command).toBe(`pm grant --user 0 ${AMPLY_PKG} ${WSS}`);
  });

  it('skips with the Amply message key when already granted', async () => {
    const result = await grantCmd.check!(runner({ installed: true, granted: true }));
    expect(result.proceed).toBe(false);
    expect(result.message).toBe('app.amply.cmd.grant-write-secure-settings.checkGranted');
  });

  it('proceeds with the Amply message key when not granted', async () => {
    const result = await grantCmd.check!(runner({ installed: true, granted: false }));
    expect(result.proceed).toBe(true);
    expect(result.message).toBe('app.amply.cmd.grant-write-secure-settings.checkNotGranted');
  });

  it('grants and verifies when installed for user 0', async () => {
    const state: FakeState = { installed: true, granted: false };
    await expect(grantCmd.execute!(runner(state))).resolves.toBe('');
    expect(state.granted).toBe(true);
  });

  it('fails with an actionable message when not installed for user 0', async () => {
    await expect(grantCmd.execute!(runner({ installed: false, granted: false }))).rejects.toThrow(
      /not installed for the primary user/i,
    );
  });

  it('fails when the grant does not take effect', async () => {
    await expect(
      grantCmd.execute!(runner({ installed: true, granted: false, grantNoop: true })),
    ).rejects.toThrow(/did not take effect/i);
  });
});

describe('amply revoke-write-secure-settings', () => {
  it('uses the exact user-0 pm revoke command for the Amply package', () => {
    expect(revokeCmd.command).toBe(`pm revoke --user 0 ${AMPLY_PKG} ${WSS}`);
  });

  it('skips with the Amply message key when already revoked', async () => {
    const result = await revokeCmd.check!(runner({ installed: true, granted: false }));
    expect(result.proceed).toBe(false);
    expect(result.message).toBe('app.amply.cmd.revoke-write-secure-settings.checkRevoked');
  });

  it('proceeds with the Amply message key when currently granted', async () => {
    const result = await revokeCmd.check!(runner({ installed: true, granted: true }));
    expect(result.proceed).toBe(true);
    expect(result.message).toBe('app.amply.cmd.revoke-write-secure-settings.checkGranted');
  });

  it('revokes and verifies', async () => {
    const state: FakeState = { installed: true, granted: true };
    await expect(revokeCmd.execute!(runner(state))).resolves.toBe('');
    expect(state.granted).toBe(false);
  });

  it('fails when the revoke does not take effect', async () => {
    await expect(
      revokeCmd.execute!(runner({ installed: true, granted: true, revokeNoop: true })),
    ).rejects.toThrow(/did not take effect/i);
  });
});

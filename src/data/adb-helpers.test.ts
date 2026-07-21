import { describe, it, expect } from 'vitest';
import { WRITE_SECURE_SETTINGS, isInstalledForUser0, isPermissionGrantedForUser0 } from './adb-helpers';

const PKG = 'eu.darken.amply';

function constRun(output: string) {
  return async () => output;
}

describe('isInstalledForUser0', () => {
  it('matches the exact package token', async () => {
    expect(await isInstalledForUser0(constRun(`package:${PKG}`), PKG)).toBe(true);
  });

  it('is false when nothing is returned', async () => {
    expect(await isInstalledForUser0(constRun(''), PKG)).toBe(false);
  });

  it('does not match a different package that contains the id as a substring', async () => {
    expect(await isInstalledForUser0(constRun(`package:${PKG}.debug`), PKG)).toBe(false);
  });
});

describe('isPermissionGrantedForUser0', () => {
  const dump = (user0Granted: boolean, extra = '') =>
    [
      'Packages:',
      `  Package [${PKG}] (abc):`,
      '    User 0:',
      '      runtime permissions:',
      `        ${WRITE_SECURE_SETTINGS}: granted=${user0Granted ? 'true' : 'false'}`,
      extra,
    ].join('\n');

  it('is true when granted in the user 0 section', async () => {
    expect(await isPermissionGrantedForUser0(constRun(dump(true)), PKG, WRITE_SECURE_SETTINGS)).toBe(true);
  });

  it('is false when not granted in the user 0 section', async () => {
    expect(await isPermissionGrantedForUser0(constRun(dump(false)), PKG, WRITE_SECURE_SETTINGS)).toBe(false);
  });

  it('does not count another user\'s grant as user 0 (the cross-user bug)', async () => {
    const withUser10 = dump(false, [
      '    User 10:',
      '      runtime permissions:',
      `        ${WRITE_SECURE_SETTINGS}: granted=true`,
    ].join('\n'));
    expect(await isPermissionGrantedForUser0(constRun(withUser10), PKG, WRITE_SECURE_SETTINGS)).toBe(false);
  });

  it('is false when the package is not installed', async () => {
    expect(
      await isPermissionGrantedForUser0(constRun(`Unable to find package: ${PKG}`), PKG, WRITE_SECURE_SETTINGS),
    ).toBe(false);
  });
});

import type { AppCategory } from '../types';
import { WRITE_SECURE_SETTINGS, isInstalledForUser0, isPermissionGrantedForUser0 } from '../adb-helpers';

const AMPLY_PKG = 'eu.darken.amply';
const GRANT_CMD = `pm grant --user 0 ${AMPLY_PKG} ${WRITE_SECURE_SETTINGS}`;
const REVOKE_CMD = `pm revoke --user 0 ${AMPLY_PKG} ${WRITE_SECURE_SETTINGS}`;

export const amply: AppCategory = {
  id: 'amply',
  name: 'Amply',
  packageName: AMPLY_PKG,
  description: 'Experimental controller for OEM battery charge-protection modes. Needs WRITE_SECURE_SETTINGS to change the charge policy directly.',
  iconUrl: 'icons/amply.png',
  commands: [
    {
      id: 'grant-write-secure-settings',
      title: 'Grant WRITE_SECURE_SETTINGS',
      description: 'Grants the WRITE_SECURE_SETTINGS permission so Amply can change the charge policy directly.',
      command: GRANT_CMD,
      risk: 'moderate',
      async check(run) {
        const granted = await isPermissionGrantedForUser0(run, AMPLY_PKG, WRITE_SECURE_SETTINGS);
        if (granted) return { proceed: false, message: 'app.amply.cmd.grant-write-secure-settings.checkGranted' };
        return { proceed: true, message: 'app.amply.cmd.grant-write-secure-settings.checkNotGranted' };
      },
      async execute(run) {
        // A grant to a package that isn't installed for user 0 silently no-ops on some
        // ROMs; detect it up front so the failure is actionable rather than "granted, but
        // nothing changed". Amply's own control is gated to the system (user 0) install.
        if (!(await isInstalledForUser0(run, AMPLY_PKG))) {
          throw new Error(
            'Amply is not installed for the primary user (user 0). Install Amply there first, then grant again.',
          );
        }
        await run(GRANT_CMD);
        // Verify rather than trust the exit code: the none-protocol fallback can't report
        // exit codes, and a silently ineffective grant should surface as a failure.
        if (!(await isPermissionGrantedForUser0(run, AMPLY_PKG, WRITE_SECURE_SETTINGS))) {
          throw new Error(
            'The grant did not take effect. Check that USB debugging is authorized and that Amply is installed for the primary user.',
          );
        }
        return '';
      },
    },
    {
      id: 'revoke-write-secure-settings',
      title: 'Revoke WRITE_SECURE_SETTINGS',
      description: 'Removes the WRITE_SECURE_SETTINGS permission from Amply. Stop or restore any active full-charge session first. Uninstalling Amply also revokes it.',
      command: REVOKE_CMD,
      risk: 'moderate',
      async check(run) {
        const granted = await isPermissionGrantedForUser0(run, AMPLY_PKG, WRITE_SECURE_SETTINGS);
        if (!granted) return { proceed: false, message: 'app.amply.cmd.revoke-write-secure-settings.checkRevoked' };
        return { proceed: true, message: 'app.amply.cmd.revoke-write-secure-settings.checkGranted' };
      },
      async execute(run) {
        await run(REVOKE_CMD);
        if (await isPermissionGrantedForUser0(run, AMPLY_PKG, WRITE_SECURE_SETTINGS)) {
          throw new Error('The revoke did not take effect. Try again, or revoke it by uninstalling Amply.');
        }
        return '';
      },
    },
  ],
};

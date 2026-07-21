import type { AppCategory } from '../types';
import { WRITE_SECURE_SETTINGS, isPermissionGrantedForUser0 } from '../adb-helpers';

const SDMAID_PKG = 'eu.darken.sdmse';
const PERMISSION = WRITE_SECURE_SETTINGS;

export const sdmaidSe: AppCategory = {
  id: 'sdmaid-se',
  name: 'SD Maid SE',
  packageName: SDMAID_PKG,
  description: 'System cleaner for Android. Some features require ADB permissions to work around OS restrictions.',
  iconUrl: 'icons/sdmaid-se.png',
  commands: [
    {
      id: 'grant-write-secure-settings',
      title: 'Grant WRITE_SECURE_SETTINGS',
      description: 'Grants the WRITE_SECURE_SETTINGS permission so SD Maid can toggle accessibility services and modify system settings directly.',
      command: `pm grant --user 0 ${SDMAID_PKG} ${PERMISSION}`,
      risk: 'safe',
      async check(run) {
        const granted = await isPermissionGrantedForUser0(run, SDMAID_PKG, PERMISSION);
        if (granted) return { proceed: false, message: 'app.sdmaid-se.cmd.grant-write-secure-settings.checkGranted' };
        return { proceed: true, message: 'app.sdmaid-se.cmd.grant-write-secure-settings.checkNotGranted' };
      },
    },
    {
      id: 'revoke-write-secure-settings',
      title: 'Revoke WRITE_SECURE_SETTINGS',
      description: 'Removes the WRITE_SECURE_SETTINGS permission from SD Maid. Use this if you no longer need the extra features. Uninstalling the app also revokes all granted permissions.',
      command: `pm revoke --user 0 ${SDMAID_PKG} ${PERMISSION}`,
      risk: 'safe',
      async check(run) {
        const granted = await isPermissionGrantedForUser0(run, SDMAID_PKG, PERMISSION);
        if (!granted) return { proceed: false, message: 'app.sdmaid-se.cmd.revoke-write-secure-settings.checkRevoked' };
        return { proceed: true, message: 'app.sdmaid-se.cmd.revoke-write-secure-settings.checkGranted' };
      },
    },
  ],
};

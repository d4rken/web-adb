import type { AppCategory } from '../types';

const SDMAID_PKG = 'eu.darken.sdmse';
const ACCESSIBILITY_SERVICE = `${SDMAID_PKG}/.automation.core.AutomationService`;

export const sdmaidSe: AppCategory = {
  id: 'sdmaid-se',
  name: 'SD Maid SE',
  packageName: SDMAID_PKG,
  description: 'System cleaner for Android. Some features require ADB permissions to work around OS restrictions.',
  commands: [
    {
      id: 're-enable-documents-app',
      title: 'Re-enable Documents app',
      description: 'Re-enables the built-in Documents UI app if it was disabled. SD Maid needs this to access certain storage areas.',
      command: 'pm enable --user 0 com.android.documentsui',
      risk: 'safe',
    },
    {
      id: 're-enable-external-storage',
      title: 'Re-enable External Storage',
      description: 'Re-enables the external storage provider if it was disabled. Required for SD Maid to access external storage.',
      command: 'pm enable --user 0 com.android.externalstorage',
      risk: 'safe',
    },
    {
      id: 'enable-accessibility-service',
      title: 'Enable Accessibility Service',
      description: 'Adds SD Maid\'s automation service to the enabled accessibility services list without removing other services.',
      command: null,
      risk: 'moderate',
      async execute(run) {
        const current = (await run('settings get secure enabled_accessibility_services')).trim();

        // "null" is returned when the setting doesn't exist
        const services = current === 'null' || current === '' ? [] : current.split(':');

        if (services.includes(ACCESSIBILITY_SERVICE)) {
          return `Accessibility service already enabled.\nCurrent list: ${current}`;
        }

        services.push(ACCESSIBILITY_SERVICE);
        const newValue = services.join(':');

        await run(`settings put secure enabled_accessibility_services '${newValue}'`);
        return `Accessibility service enabled.\nNew list: ${newValue}`;
      },
    },
    {
      id: 'grant-write-secure-settings',
      title: 'Grant WRITE_SECURE_SETTINGS',
      description: 'Grants the WRITE_SECURE_SETTINGS permission so SD Maid can toggle accessibility services and modify system settings directly.',
      command: `pm grant --user 0 ${SDMAID_PKG} android.permission.WRITE_SECURE_SETTINGS`,
      risk: 'moderate',
    },
    {
      id: 'revoke-write-secure-settings',
      title: 'Revoke WRITE_SECURE_SETTINGS',
      description: 'Removes the WRITE_SECURE_SETTINGS permission from SD Maid. Use this if you no longer need the extra features.',
      command: `pm revoke --user 0 ${SDMAID_PKG} android.permission.WRITE_SECURE_SETTINGS`,
      risk: 'safe',
    },
  ],
};

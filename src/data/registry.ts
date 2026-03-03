import type { AppCategory, CommandEntry } from './types';
import { sdmaidSe } from './apps/sdmaid-se';

export const apps: AppCategory[] = [sdmaidSe];

export function findApp(appId: string): AppCategory | undefined {
  return apps.find((a) => a.id === appId);
}

export function findCommand(appId: string, commandId: string): { app: AppCategory; command: CommandEntry } | undefined {
  const app = findApp(appId);
  if (!app) return undefined;
  const command = app.commands.find((c) => c.id === commandId);
  if (!command) return undefined;
  return { app, command };
}

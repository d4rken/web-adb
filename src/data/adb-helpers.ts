export const WRITE_SECURE_SETTINGS = 'android.permission.WRITE_SECURE_SETTINGS';

type Run = (cmd: string) => Promise<string>;

/** True if `pkg` is installed for user 0 (the primary/owner user). */
export async function isInstalledForUser0(run: Run, pkg: string): Promise<boolean> {
  const out = await run(`pm list packages --user 0 ${pkg}`);
  // `pm list packages <filter>` matches the filter as a substring, so compare the
  // whole `package:<name>` token rather than a substring to avoid matching siblings.
  return out.split(/\r?\n/).some((line) => line.trim() === `package:${pkg}`);
}

/**
 * True if `permission` is granted to `pkg` for user 0.
 *
 * Parses `dumpsys package <pkg>` and scopes the check to the `User 0:` section, so a
 * grant to another user (e.g. a work profile as user 10) is never misread as user 0's.
 * `dumpsys` exits 0 even when the package is absent, so this stays safe under the strict
 * nonzero-exit handling in executeCommand — unlike a `grep` pipeline, whose exit code 1
 * on "no match" would be treated as a command failure.
 */
export async function isPermissionGrantedForUser0(
  run: Run,
  pkg: string,
  permission: string,
): Promise<boolean> {
  const dump = await run(`dumpsys package ${pkg}`);
  // A `pm grant --user 0` lands in user 0's runtime-permission block. If no per-user
  // block is present (unusual), fall back to the whole dump rather than reporting false.
  const section = userSection(dump, 0) ?? dump;
  const pattern = new RegExp(`${escapeRegExp(permission)}:\\s*granted=true`);
  return pattern.test(section);
}

/** Extract the `User <id>:` block from dumpsys output, up to the next `User <n>:` or end. */
function userSection(dump: string, userId: number): string | null {
  const marker = new RegExp(`(^|\\n)\\s*User ${userId}:`);
  const start = dump.search(marker);
  if (start === -1) return null;
  const rest = dump.slice(start).replace(marker, '');
  const next = rest.search(/\n\s*User \d+:/);
  return next === -1 ? rest : rest.slice(0, next);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

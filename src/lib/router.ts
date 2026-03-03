export interface Route {
  appId?: string;
  commandId?: string;
}

export function parseHash(hash: string): Route {
  // Expected format: #/appId/commandId or #/appId or #/
  const stripped = hash.replace(/^#\/?/, '');
  if (!stripped) return {};

  const parts = stripped.split('/').filter(Boolean);
  return {
    appId: parts[0] || undefined,
    commandId: parts[1] || undefined,
  };
}

export function buildHash(route: Route): string {
  if (route.commandId && route.appId) {
    return `#/${route.appId}/${route.commandId}`;
  }
  if (route.appId) {
    return `#/${route.appId}`;
  }
  return '#/';
}

export function navigateTo(route: Route): void {
  const hash = buildHash(route);
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

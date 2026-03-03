export type ConnectionState =
  | { status: 'disconnected' }
  | { status: 'requesting-device' }
  | { status: 'connecting' }
  | { status: 'authenticating' }
  | { status: 'connected'; deviceName: string; androidVersion: string }
  | { status: 'error'; error: string; detail?: string };

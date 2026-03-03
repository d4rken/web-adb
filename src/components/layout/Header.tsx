import type { ConnectionState } from '../../adb/types';
import { APP_NAME, APP_VERSION } from '../../lib/constants';

interface HeaderProps {
  state: ConnectionState;
  onDisconnect: () => void;
}

const statusConfig = {
  disconnected: { label: 'Not connected', color: 'bg-warm-300 text-warm-600' },
  'requesting-device': { label: 'Looking...', color: 'bg-warning-light text-warning-dark animate-gentle-pulse' },
  connecting: { label: 'Connecting...', color: 'bg-warning-light text-warning-dark animate-gentle-pulse' },
  authenticating: { label: 'Waiting for phone...', color: 'bg-warning-light text-warning-dark animate-gentle-pulse' },
  connected: { label: 'Connected', color: 'bg-success-light text-success-dark' },
  error: { label: 'Problem', color: 'bg-danger-light text-danger-dark' },
} as const;

export function Header({ state, onDisconnect }: HeaderProps) {
  const { label, color } = statusConfig[state.status];

  return (
    <header className="flex items-center justify-between border-b border-warm-200 bg-warm-100 px-4 py-3">
      <a href="#" className="flex items-center gap-2 no-underline">
        <h1 className="text-xl font-bold text-warm-800">{APP_NAME}</h1>
        <span className="text-sm text-warm-400">{APP_VERSION}</span>
      </a>

      <div className="flex items-center gap-3">
        {state.status === 'connected' && (
          <>
            <div className="text-right">
              <span className="text-sm text-warm-600">Connected to {state.deviceName}</span>
              <p className="text-xs text-warm-400">Android {state.androidVersion}</p>
            </div>
            <button
              onClick={onDisconnect}
              className="rounded-lg border border-warm-300 px-2.5 py-1 text-xs font-medium text-warm-600 hover:bg-warm-200 transition-colors"
            >
              Disconnect
            </button>
          </>
        )}
        {state.status !== 'connected' && (
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${color}`}>
            {label}
          </span>
        )}
      </div>
    </header>
  );
}

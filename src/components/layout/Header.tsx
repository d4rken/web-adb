import type { ConnectionState } from '../../adb/types';
import { APP_TITLE } from '../../lib/constants';

interface HeaderProps {
  state: ConnectionState;
}

const statusConfig = {
  disconnected: { label: 'Disconnected', color: 'bg-gray-400' },
  'requesting-device': { label: 'Selecting…', color: 'bg-amber-400 animate-pulse' },
  connecting: { label: 'Connecting…', color: 'bg-amber-400 animate-pulse' },
  authenticating: { label: 'Authenticating…', color: 'bg-amber-400 animate-pulse' },
  connected: { label: 'Connected', color: 'bg-green-500' },
  error: { label: 'Error', color: 'bg-red-500' },
} as const;

export function Header({ state }: HeaderProps) {
  const { label, color } = statusConfig[state.status];

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <h1 className="text-lg font-semibold text-gray-900">{APP_TITLE}</h1>

      <div className="flex items-center gap-3">
        {state.status === 'connected' && (
          <span className="text-sm text-gray-500">
            {state.deviceName} · Android {state.androidVersion}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      </div>
    </header>
  );
}

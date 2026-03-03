import type { ConnectionState } from '../../adb/types';
import { BrowserCheck } from '../shared/BrowserCheck';
import { UsbDebuggingGuide } from '../shared/UsbDebuggingGuide';

interface StepConnectProps {
  state: ConnectionState;
  onConnect: () => void;
  onResetKey: () => void;
}

export function StepConnect({ state, onConnect, onResetKey }: StepConnectProps) {
  const isLoading = state.status === 'requesting-device' || state.status === 'connecting' || state.status === 'authenticating';

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        This tool runs setup commands on your Android device directly from your browser.
        Just plug in your phone via USB, pick an app, and choose a command — no extra software needed.
      </p>

      <BrowserCheck />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Connect Your Device</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect your Android device via USB and enable USB debugging.
        </p>

        <button
          onClick={onConnect}
          disabled={isLoading}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? statusLabel(state.status) : 'Connect Device'}
        </button>

        {state.status === 'error' && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">{state.error}</p>
            {state.detail && <p className="mt-1 text-sm text-red-700">{state.detail}</p>}
          </div>
        )}

        {state.status === 'authenticating' && (
          <p className="mt-3 text-sm text-amber-700">
            Tap <strong>"Allow"</strong> on the USB debugging prompt on your phone.
          </p>
        )}
      </div>

      <UsbDebuggingGuide />

      <div className="text-center">
        <button
          onClick={onResetKey}
          className="text-xs text-gray-400 underline hover:text-gray-600"
        >
          Reset ADB Key
        </button>
        <p className="mt-1 text-xs text-gray-400">
          Use this if authentication is stuck. You'll need to re-approve the connection on your phone.
        </p>
      </div>
    </div>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case 'requesting-device': return 'Selecting device…';
    case 'connecting': return 'Connecting…';
    case 'authenticating': return 'Authenticating…';
    default: return 'Connecting…';
  }
}

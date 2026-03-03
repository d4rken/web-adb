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
      <p className="text-base text-warm-600">
        This tool runs setup commands on your Android phone directly from your browser.
        Just plug in your phone via USB, pick an app, and choose what to do.
      </p>

      <BrowserCheck />

      <div className="card-warm p-8">
        <h2 className="text-xl font-bold text-warm-800">Let's get started!</h2>
        <p className="mt-2 text-base text-warm-600">
          Plug your Android phone into this computer with a USB cable, then tap the button below.
        </p>

        <button
          onClick={onConnect}
          disabled={isLoading}
          className="mt-5 rounded-xl bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? statusLabel(state.status) : 'Connect My Phone'}
        </button>

        {state.status === 'error' && (
          <div className="mt-4 rounded-xl border border-danger bg-danger-light p-4">
            <p className="text-sm font-medium text-danger-dark">Something went wrong, but don't worry:</p>
            <p className="mt-1 text-sm text-danger-dark">{state.error}</p>
            {state.detail && <p className="mt-1 text-sm text-danger-dark">{state.detail}</p>}
          </div>
        )}

        {state.status === 'authenticating' && (
          <div className="mt-4 rounded-xl border border-warning bg-warning-light p-4">
            <p className="text-base text-warning-dark">
              Look at your phone now — you should see a popup asking for permission.
              Tap <strong>"Allow"</strong> to continue.
            </p>
          </div>
        )}
      </div>

      <UsbDebuggingGuide />

      <div className="text-center">
        <button
          onClick={onResetKey}
          className="text-sm text-warm-400 underline hover:text-warm-600"
        >
          Connection trouble?
        </button>
        <p className="mt-1 text-sm text-warm-400">
          If connecting seems stuck, tap this to reset and try again.
        </p>
      </div>
    </div>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case 'requesting-device': return 'Looking for your phone...';
    case 'connecting': return 'Connecting...';
    case 'authenticating': return 'Check your phone\'s screen...';
    default: return 'Connecting...';
  }
}

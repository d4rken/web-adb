import type { ConnectionState } from '../../adb/types';
import { BrowserCheck } from '../shared/BrowserCheck';
import { UsbDebuggingGuide } from '../shared/UsbDebuggingGuide';
import { useTranslation, Trans } from 'react-i18next';

interface StepConnectProps {
  state: ConnectionState;
  onConnect: () => void;
  onResetKey: () => void;
}

export function StepConnect({ state, onConnect, onResetKey }: StepConnectProps) {
  const { t } = useTranslation();
  const isLoading = state.status === 'requesting-device' || state.status === 'connecting' || state.status === 'authenticating';

  function statusLabel(status: string): string {
    switch (status) {
      case 'requesting-device': return t('connect.statusRequesting');
      case 'connecting': return t('connect.statusConnecting');
      case 'authenticating': return t('connect.statusAuthenticating');
      default: return t('connect.statusConnecting');
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-base text-warm-600">
        {t('connect.intro')}
      </p>

      <BrowserCheck />

      <div className="card-warm p-8">
        <h2 className="text-xl font-bold text-warm-800">{t('connect.title')}</h2>
        <p className="mt-2 text-base text-warm-600">
          {t('connect.subtitle')}
        </p>

        <button
          onClick={onConnect}
          disabled={isLoading}
          className="mt-5 rounded-xl bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? statusLabel(state.status) : t('connect.button')}
        </button>

        {state.status === 'error' && (
          <div className="mt-4 rounded-xl border border-danger bg-danger-light p-4">
            <p className="text-sm font-medium text-danger-dark">{t('connect.error')}</p>
            <p className="mt-1 text-sm text-danger-dark">{state.error}</p>
            {state.detail && <p className="mt-1 text-sm text-danger-dark">{state.detail}</p>}
          </div>
        )}

        {state.status === 'authenticating' && (
          <div className="mt-4 rounded-xl border border-warning bg-warning-light p-4">
            <p className="text-base text-warning-dark">
              <Trans i18nKey="connect.authPrompt">
                Look at your phone now — you should see a popup asking for permission.
                Tap <strong>"Allow"</strong> to continue.
              </Trans>
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
          {t('connect.resetButton')}
        </button>
        <p className="mt-1 text-sm text-warm-400">
          {t('connect.resetHint')}
        </p>
      </div>
    </div>
  );
}

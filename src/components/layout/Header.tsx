import type { ConnectionState } from '../../adb/types';
import { APP_NAME, APP_VERSION } from '../../lib/constants';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  state: ConnectionState;
  onDisconnect: () => void;
}

const languages = [
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português' },
  { code: 'zh-CN', flag: '🇨🇳', label: '中文' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'el', flag: '🇬🇷', label: 'Ελληνικά' },
];

function resolvedLanguage(i18n: { resolvedLanguage?: string; language: string }): string {
  return i18n.resolvedLanguage ?? i18n.language;
}

export function Header({ state, onDisconnect }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const statusConfig = {
    disconnected: { label: t('header.disconnected'), color: 'bg-warm-300 text-warm-600' },
    'requesting-device': { label: t('header.requesting'), color: 'bg-warning-light text-warning-dark animate-gentle-pulse' },
    connecting: { label: t('header.connecting'), color: 'bg-warning-light text-warning-dark animate-gentle-pulse' },
    authenticating: { label: t('header.authenticating'), color: 'bg-warning-light text-warning-dark animate-gentle-pulse' },
    connected: { label: t('header.connected'), color: 'bg-success-light text-success-dark' },
    error: { label: t('header.error'), color: 'bg-danger-light text-danger-dark' },
  } as const;

  const { label, color } = statusConfig[state.status];

  return (
    <header className="flex items-center justify-between border-b border-warm-200 bg-warm-100 px-4 py-3">
      <div className="flex items-center gap-3">
        <a href="#" className="flex items-center gap-2 no-underline">
          <h1 className="text-xl font-bold text-warm-800">{APP_NAME}</h1>
          <span className="text-sm text-warm-400">{APP_VERSION}</span>
        </a>
        <select
          value={resolvedLanguage(i18n)}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="rounded-lg border border-warm-300 bg-warm-100 px-2 py-1 text-xs text-warm-600 hover:bg-warm-200 transition-colors"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.flag} {lang.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        {state.status === 'connected' && (
          <>
            <div className="text-right">
              <span className="text-sm text-warm-600">{t('header.connectedTo', { deviceName: state.deviceName })}</span>
              <p className="text-xs text-warm-400">{t('header.androidVersion', { androidVersion: state.androidVersion })}</p>
            </div>
            <button
              onClick={onDisconnect}
              className="rounded-lg border border-warm-300 px-2.5 py-1 text-xs font-medium text-warm-600 hover:bg-warm-200 transition-colors"
            >
              {t('header.disconnect')}
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

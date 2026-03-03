import { isWebUsbSupported, isSecureContext } from '../../adb/connection';
import { useTranslation, Trans } from 'react-i18next';

export function BrowserCheck() {
  const { t } = useTranslation();

  if (!isSecureContext()) {
    return (
      <div className="rounded-2xl border border-danger bg-danger-light p-6 text-center">
        <h2 className="text-lg font-bold text-danger-dark">{t('browser.secureTitle')}</h2>
        <p className="mt-2 text-base text-danger-dark">
          <Trans i18nKey="browser.secureMessage">
            This page needs a secure connection. Please make sure the web address starts
            with <strong>https://</strong> or open it on localhost.
          </Trans>
        </p>
      </div>
    );
  }

  if (!isWebUsbSupported()) {
    return (
      <div className="rounded-2xl border border-danger bg-danger-light p-6 text-center">
        <h2 className="text-lg font-bold text-danger-dark">{t('browser.browserTitle')}</h2>
        <p className="mt-2 text-base text-danger-dark">
          <Trans i18nKey="browser.browserMessage">
            This tool needs <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on
            a computer. Please switch to one of those browsers.
          </Trans>
        </p>
      </div>
    );
  }

  return null;
}

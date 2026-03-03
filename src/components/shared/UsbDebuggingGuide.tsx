import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

type OS = 'windows' | 'macos' | 'linux';

function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'macos';
  return 'linux';
}

export function UsbDebuggingGuide() {
  const [expanded, setExpanded] = useState(false);
  const os = detectOS();
  const { t } = useTranslation();

  return (
    <div className="card-warm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left text-base font-medium text-warm-700 hover:bg-warm-200 rounded-2xl transition-colors"
      >
        <span>{t('usbGuide.title')}</span>
        <span className="text-warm-400">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="border-t border-warm-200 p-5 text-base text-warm-700 space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li><Trans i18nKey="usbGuide.step1">Open <strong>Settings</strong> on your Android phone</Trans></li>
            <li><Trans i18nKey="usbGuide.step2">Go to <strong>About phone</strong></Trans></li>
            <li><Trans i18nKey="usbGuide.step3">Tap <strong>Build number</strong> 7 times to unlock Developer Options</Trans></li>
            <li><Trans i18nKey="usbGuide.step4">Go back to <strong>Settings</strong>, then <strong>Developer options</strong></Trans></li>
            <li><Trans i18nKey="usbGuide.step5">Turn on <strong>USB debugging</strong></Trans></li>
            <li><Trans i18nKey="usbGuide.step6">Connect your phone to this computer with a USB cable</Trans></li>
          </ol>

          {os === 'windows' && (
            <div className="rounded-xl bg-warning-light border border-warning p-4">
              <p className="font-medium text-warning-dark">{t('usbGuide.windowsTitle')}</p>
              <p className="mt-1 text-warning-dark">
                {t('usbGuide.windowsMessage')}{' '}
                <a
                  href="https://developer.android.com/studio/run/win-usb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {t('usbGuide.windowsLink')}
                </a>
              </p>
            </div>
          )}

          {os === 'linux' && (
            <div className="rounded-xl bg-warning-light border border-warning p-4">
              <p className="font-medium text-warning-dark">{t('usbGuide.linuxTitle')}</p>
              <p className="mt-1 text-warning-dark">
                {t('usbGuide.linuxMessage')}{' '}
                <a
                  href="https://developer.android.com/studio/run/device#setting-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {t('usbGuide.linuxLink')}
                </a>
              </p>
            </div>
          )}

          <div className="rounded-xl bg-primary-50 border border-primary-200 p-4">
            <p className="text-primary-700">
              <Trans i18nKey="usbGuide.tip">
                <strong>Tip:</strong> Make sure you're using a USB cable that can transfer
                data — some cables only charge.
              </Trans>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

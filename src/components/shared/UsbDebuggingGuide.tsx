import { useState } from 'react';

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

  return (
    <div className="card-warm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left text-base font-medium text-warm-700 hover:bg-warm-200 rounded-2xl transition-colors"
      >
        <span>Need help setting up your phone?</span>
        <span className="text-warm-400">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="border-t border-warm-200 p-5 text-base text-warm-700 space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Open <strong>Settings</strong> on your Android phone</li>
            <li>Go to <strong>About phone</strong></li>
            <li>Tap <strong>Build number</strong> 7 times to unlock Developer Options</li>
            <li>Go back to <strong>Settings</strong>, then <strong>Developer options</strong></li>
            <li>Turn on <strong>USB debugging</strong></li>
            <li>Connect your phone to this computer with a USB cable</li>
          </ol>

          {os === 'windows' && (
            <div className="rounded-xl bg-warning-light border border-warning p-4">
              <p className="font-medium text-warning-dark">Windows users</p>
              <p className="mt-1 text-warning-dark">
                You might need to install a USB driver for your phone.{' '}
                <a
                  href="https://developer.android.com/studio/run/win-usb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Get the Google USB Driver
                </a>
              </p>
            </div>
          )}

          {os === 'linux' && (
            <div className="rounded-xl bg-warning-light border border-warning p-4">
              <p className="font-medium text-warning-dark">Linux users</p>
              <p className="mt-1 text-warning-dark">
                You may need to set up udev rules for your device.{' '}
                <a
                  href="https://developer.android.com/studio/run/device#setting-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  See the Android guide
                </a>
              </p>
            </div>
          )}

          <div className="rounded-xl bg-primary-50 border border-primary-200 p-4">
            <p className="text-primary-700">
              <strong>Tip:</strong> Make sure you're using a USB cable that can transfer
              data — some cables only charge.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

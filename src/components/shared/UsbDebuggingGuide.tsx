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
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>How to enable USB debugging</span>
        <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 p-4 text-sm text-gray-600 space-y-3">
          <ol className="list-decimal list-inside space-y-2">
            <li>Open <strong>Settings</strong> on your Android device</li>
            <li>Go to <strong>About phone</strong></li>
            <li>Tap <strong>Build number</strong> 7 times to enable Developer Options</li>
            <li>Go back to <strong>Settings → Developer options</strong></li>
            <li>Enable <strong>USB debugging</strong></li>
            <li>Connect your phone to this computer via USB</li>
          </ol>

          {os === 'windows' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="font-medium text-amber-800">Windows: USB Driver Required</p>
              <p className="mt-1 text-amber-700">
                You may need to install the{' '}
                <a
                  href="https://developer.android.com/studio/run/win-usb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Google USB Driver
                </a>{' '}
                or your device manufacturer's USB driver.
              </p>
            </div>
          )}

          {os === 'linux' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="font-medium text-amber-800">Linux: udev Rules</p>
              <p className="mt-1 text-amber-700">
                You may need to add udev rules for your device. See the{' '}
                <a
                  href="https://developer.android.com/studio/run/device#setting-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Android documentation
                </a>{' '}
                for details.
              </p>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-blue-800">
              <strong>Tip:</strong> Make sure you're using a <strong>data-capable USB cable</strong>,
              not a charge-only cable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

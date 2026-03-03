import { isWebUsbSupported, isSecureContext } from '../../adb/connection';

export function BrowserCheck() {
  if (!isSecureContext()) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800">Secure Context Required</h2>
        <p className="mt-2 text-red-700">
          WebUSB requires HTTPS. Please access this page over HTTPS or on localhost.
        </p>
      </div>
    );
  }

  if (!isWebUsbSupported()) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800">Browser Not Supported</h2>
        <p className="mt-2 text-red-700">
          Your browser does not support WebUSB. Please use{' '}
          <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on desktop.
        </p>
      </div>
    );
  }

  return null;
}

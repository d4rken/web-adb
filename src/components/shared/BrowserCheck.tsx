import { isWebUsbSupported, isSecureContext } from '../../adb/connection';

export function BrowserCheck() {
  if (!isSecureContext()) {
    return (
      <div className="rounded-2xl border border-danger bg-danger-light p-6 text-center">
        <h2 className="text-lg font-bold text-danger-dark">Secure Connection Needed</h2>
        <p className="mt-2 text-base text-danger-dark">
          This page needs a secure connection. Please make sure the web address starts
          with <strong>https://</strong> or open it on localhost.
        </p>
      </div>
    );
  }

  if (!isWebUsbSupported()) {
    return (
      <div className="rounded-2xl border border-danger bg-danger-light p-6 text-center">
        <h2 className="text-lg font-bold text-danger-dark">Different Browser Needed</h2>
        <p className="mt-2 text-base text-danger-dark">
          This tool needs <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on
          a computer. Please switch to one of those browsers.
        </p>
      </div>
    );
  }

  return null;
}

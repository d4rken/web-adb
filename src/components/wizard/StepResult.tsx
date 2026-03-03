import { navigateTo } from '../../lib/router';

interface StepResultProps {
  success: boolean;
  output: string;
  appId?: string;
  onDisconnect: () => void;
}

export function StepResult({ success, output, appId, onDisconnect }: StepResultProps) {
  return (
    <div className="space-y-4">
      <div className={`rounded-xl border p-4 ${success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <h2 className={`text-lg font-semibold ${success ? 'text-green-800' : 'text-red-800'}`}>
          {success ? 'Command Succeeded' : 'Command Failed'}
        </h2>
        {output && (
          <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-900 p-3 text-sm text-gray-200 overflow-x-auto">
            {output}
          </pre>
        )}
        {!success && (
          <div className="mt-3 text-sm text-red-700 space-y-1">
            <p>Troubleshooting:</p>
            <ul className="list-disc list-inside">
              <li>Make sure the app is installed on your device</li>
              <li>Check that USB debugging is still enabled</li>
              <li>Try disconnecting and reconnecting</li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigateTo(appId ? { appId } : {})}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Run Another Command
        </button>
        <button
          onClick={onDisconnect}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

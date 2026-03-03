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
      <div className={`rounded-2xl border p-6 shadow-card ${success ? 'border-success bg-success-light' : 'border-danger bg-danger-light'}`}>
        <h2 className={`text-2xl font-bold ${success ? 'text-success-dark animate-celebrate' : 'text-danger-dark animate-fade-in'}`}>
          {success ? 'All done!' : 'Hmm, that didn\'t work'}
        </h2>

        {output && (
          <details className="mt-3 group">
            <summary className={`cursor-pointer text-sm select-none list-none hover:opacity-80 ${success ? 'text-success-dark' : 'text-danger-dark'}`}>
              <span className="group-open:hidden">Show technical output ▸</span>
              <span className="hidden group-open:inline">Hide technical output ▾</span>
            </summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-warm-800 p-3 text-sm text-warm-200 overflow-x-auto">
              {output}
            </pre>
          </details>
        )}

        {!success && (
          <div className="mt-4 text-base text-danger-dark space-y-2">
            <p className="font-medium">Here are a few things to try:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check that the app is installed on your phone</li>
              <li>Make sure USB debugging is still turned on</li>
              <li>Try unplugging and plugging in your phone again</li>
            </ul>
            <p className="text-sm mt-3">If it still doesn't work, reach out for help below.</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigateTo(appId ? { appId } : {})}
          className="flex-1 rounded-xl bg-primary-500 px-4 py-3 text-base font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-card-hover"
        >
          Do Something Else
        </button>
        <button
          onClick={onDisconnect}
          className="rounded-xl border border-warm-300 px-4 py-3 text-base font-medium text-warm-600 transition-all hover:bg-warm-200"
        >
          I'm Finished
        </button>
      </div>
    </div>
  );
}

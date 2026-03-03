import { apps } from '../../data/registry';
import { navigateTo } from '../../lib/router';

export function StepSelectApp() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Select App</h2>
        <p className="mt-1 text-sm text-gray-500">Choose the app you need ADB commands for.</p>
      </div>

      <div className="grid gap-3">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => navigateTo({ appId: app.id })}
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
          >
            <h3 className="font-medium text-gray-900">{app.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{app.description}</p>
            <p className="mt-2 text-xs text-gray-400 font-mono">{app.packageName}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

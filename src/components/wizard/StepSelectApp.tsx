import { apps } from '../../data/registry';
import { navigateTo } from '../../lib/router';

export function StepSelectApp() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-warm-800">What app do you need help with?</h2>
        <p className="mt-1 text-base text-warm-500">Tap the app you want to set up.</p>
      </div>

      <div className="grid gap-3">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => navigateTo({ appId: app.id })}
            className="card-warm-interactive flex w-full items-center gap-4 p-5 text-left"
          >
            {app.iconUrl ? (
              <img
                src={`${import.meta.env.BASE_URL}${app.iconUrl}`}
                alt=""
                className="h-12 w-12 shrink-0 rounded-2xl shadow-sm"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-warm-200" />
            )}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-warm-800">{app.name}</h3>
              <p className="mt-1 text-base text-warm-600">{app.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

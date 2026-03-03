import { apps } from '../../data/registry';
import { navigateTo } from '../../lib/router';
import { useTranslation } from 'react-i18next';

export function StepSelectApp() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-warm-800">{t('selectApp.title')}</h2>
        <p className="mt-1 text-base text-warm-500">{t('selectApp.subtitle')}</p>
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
              <h3 className="text-lg font-semibold text-warm-800">{t(`app.${app.id}.name`)}</h3>
              <p className="mt-1 text-base text-warm-600">{t(`app.${app.id}.description`)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

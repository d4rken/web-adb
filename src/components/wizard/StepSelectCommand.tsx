import type { AppCategory } from '../../data/types';
import { navigateTo } from '../../lib/router';
import { CommandCard } from '../shared/CommandCard';
import { useTranslation } from 'react-i18next';

interface StepSelectCommandProps {
  app: AppCategory;
}

export function StepSelectCommand({ app }: StepSelectCommandProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => navigateTo({})}
          className="text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          {t('selectCommand.back')}
        </button>
        <h2 className="mt-1 text-xl font-bold text-warm-800">{t(`app.${app.id}.name`)}</h2>
        <p className="mt-1 text-base text-warm-500">{t('selectCommand.subtitle')}</p>
      </div>

      <div className="grid gap-3">
        {app.commands.map((cmd) => (
          <CommandCard
            key={cmd.id}
            appId={app.id}
            command={cmd}
            onClick={() => navigateTo({ appId: app.id, commandId: cmd.id })}
          />
        ))}
      </div>
    </div>
  );
}

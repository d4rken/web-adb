import type { CommandEntry } from '../../data/types';
import { useTranslation } from 'react-i18next';

const riskColors = {
  safe: 'bg-success-light text-success-dark',
  moderate: 'bg-warning-light text-warning-dark',
  elevated: 'bg-danger-light text-danger-dark',
} as const;

interface CommandCardProps {
  appId: string;
  command: CommandEntry;
  onClick: () => void;
}

export function CommandCard({ appId, command, onClick }: CommandCardProps) {
  const { t } = useTranslation();

  const riskLabels = {
    safe: t('risk.safe'),
    moderate: t('risk.moderate'),
    elevated: t('risk.elevated'),
  };

  return (
    <button
      onClick={onClick}
      className="card-warm-interactive w-full p-5 text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-warm-800">{t(`app.${appId}.cmd.${command.id}.title`)}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${riskColors[command.risk]}`}>
          {riskLabels[command.risk]}
        </span>
      </div>
      <p className="mt-1 text-base text-warm-600">{t(`app.${appId}.cmd.${command.id}.description`)}</p>
    </button>
  );
}

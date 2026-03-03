import type { AppCategory, CommandEntry } from '../../data/types';
import { navigateTo } from '../../lib/router';
import { useTranslation } from 'react-i18next';

const riskColors = {
  safe: 'bg-success-light text-success-dark border-success',
  moderate: 'bg-warning-light text-warning-dark border-warning',
  elevated: 'bg-danger-light text-danger-dark border-danger',
} as const;

interface StepReviewProps {
  app: AppCategory;
  command: CommandEntry;
  onExecute: () => void;
  isExecuting: boolean;
}

export function StepReview({ app, command, onExecute, isExecuting }: StepReviewProps) {
  const { t } = useTranslation();

  const riskMessages = {
    safe: t('review.riskSafe'),
    moderate: t('review.riskModerate'),
    elevated: t('review.riskElevated'),
  };

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => navigateTo({ appId: app.id })}
          className="text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          {t('review.back')}
        </button>
        <h2 className="mt-1 text-xl font-bold text-warm-800">{t('review.title')}</h2>
      </div>

      <div className="card-warm p-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-warm-400 uppercase tracking-wide">{t('review.labelApp')}</p>
          <p className="text-base text-warm-800">{t(`app.${app.id}.name`)}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-warm-400 uppercase tracking-wide">{t('review.labelAction')}</p>
          <p className="text-base font-medium text-warm-800">{t(`app.${app.id}.cmd.${command.id}.title`)}</p>
          <p className="mt-1 text-base text-warm-600">{t(`app.${app.id}.cmd.${command.id}.description`)}</p>
        </div>

        <details className="group">
          <summary className="cursor-pointer text-sm text-warm-400 select-none list-none hover:text-warm-500">
            <span className="group-open:hidden">{t('review.showDetails')}</span>
            <span className="hidden group-open:inline">{t('review.hideDetails')}</span>
          </summary>
          {command.command ? (
            <pre className="mt-2 rounded-xl bg-warm-800 p-3 text-sm text-primary-300 overflow-x-auto">
              {command.command}
            </pre>
          ) : (
            <p className="mt-2 text-sm text-warm-500 italic">
              {t('review.multiStep')}
            </p>
          )}
        </details>

        <div className={`rounded-xl border p-4 ${riskColors[command.risk]}`}>
          <p className="text-sm">{riskMessages[command.risk]}</p>
        </div>
      </div>

      <button
        onClick={onExecute}
        disabled={isExecuting}
        className={`w-full rounded-xl bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-card-hover disabled:cursor-not-allowed ${isExecuting ? 'animate-gentle-pulse' : ''}`}
      >
        {isExecuting ? t('review.buttonExecuting') : t('review.buttonExecute')}
      </button>
    </div>
  );
}

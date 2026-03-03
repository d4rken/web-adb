import type { CommandEntry } from '../../data/types';

const riskColors = {
  safe: 'bg-success-light text-success-dark',
  moderate: 'bg-warning-light text-warning-dark',
  elevated: 'bg-danger-light text-danger-dark',
} as const;

const riskLabels = {
  safe: 'safe',
  moderate: 'caution',
  elevated: 'advanced',
} as const;

interface CommandCardProps {
  command: CommandEntry;
  onClick: () => void;
}

export function CommandCard({ command, onClick }: CommandCardProps) {
  return (
    <button
      onClick={onClick}
      className="card-warm-interactive w-full p-5 text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-warm-800">{command.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${riskColors[command.risk]}`}>
          {riskLabels[command.risk]}
        </span>
      </div>
      <p className="mt-1 text-base text-warm-600">{command.description}</p>
    </button>
  );
}

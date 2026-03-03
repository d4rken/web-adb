import type { CommandEntry } from '../../data/types';

const riskColors = {
  safe: 'bg-green-100 text-green-800',
  moderate: 'bg-amber-100 text-amber-800',
  elevated: 'bg-red-100 text-red-800',
} as const;

interface CommandCardProps {
  command: CommandEntry;
  onClick: () => void;
}

export function CommandCard({ command, onClick }: CommandCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{command.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${riskColors[command.risk]}`}>
          {command.risk}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{command.description}</p>
    </button>
  );
}

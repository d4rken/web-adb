import type { AppCategory, CommandEntry } from '../../data/types';
import { navigateTo } from '../../lib/router';

const riskColors = {
  safe: 'bg-green-100 text-green-800 border-green-200',
  moderate: 'bg-amber-100 text-amber-800 border-amber-200',
  elevated: 'bg-red-100 text-red-800 border-red-200',
} as const;

const riskLabels = {
  safe: 'Safe — easily reversible',
  moderate: 'Moderate — changes system settings',
  elevated: 'Elevated — significant system changes',
} as const;

const riskMessages = {
  safe: 'This command is safe and easily reversible.',
  moderate: 'This command modifies system settings. Review carefully before executing.',
  elevated: 'This command makes significant system changes. Proceed with caution.',
} as const;

interface StepReviewProps {
  app: AppCategory;
  command: CommandEntry;
  onExecute: () => void;
  isExecuting: boolean;
}

export function StepReview({ app, command, onExecute, isExecuting }: StepReviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => navigateTo({ appId: app.id })}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to commands
        </button>
        <h2 className="mt-1 text-lg font-semibold text-gray-900">Review Command</h2>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">App</p>
          <p className="text-sm text-gray-900">{app.name}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Command</p>
          <p className="text-sm font-medium text-gray-900">{command.title}</p>
          <p className="mt-1 text-sm text-gray-500">{command.description}</p>
        </div>

        <details className="group">
          <summary className="cursor-pointer text-xs font-medium text-gray-400 uppercase tracking-wide select-none list-none">
            <span className="group-open:hidden">▶ Show technical details</span>
            <span className="hidden group-open:inline">▼ Hide technical details</span>
          </summary>
          {command.command ? (
            <pre className="mt-1 rounded-lg bg-gray-900 p-3 text-sm text-green-400 overflow-x-auto">
              {command.command}
            </pre>
          ) : (
            <p className="mt-1 text-sm text-gray-500 italic">
              Multi-step command (reads current value, modifies, writes back)
            </p>
          )}
        </details>

        <div className={`rounded-lg border p-3 ${riskColors[command.risk]}`}>
          <p className="text-sm font-medium">{riskLabels[command.risk]}</p>
          <p className="mt-0.5 text-sm">{riskMessages[command.risk]}</p>
        </div>
      </div>

      <button
        onClick={onExecute}
        disabled={isExecuting}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExecuting ? 'Executing…' : 'Execute Command'}
      </button>
    </div>
  );
}

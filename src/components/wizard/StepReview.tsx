import type { AppCategory, CommandEntry } from '../../data/types';
import { navigateTo } from '../../lib/router';

const riskColors = {
  safe: 'bg-success-light text-success-dark border-success',
  moderate: 'bg-warning-light text-warning-dark border-warning',
  elevated: 'bg-danger-light text-danger-dark border-danger',
} as const;

const riskMessages = {
  safe: 'This is safe and can be undone anytime.',
  moderate: 'This changes a system setting. You can reverse it later.',
  elevated: 'This is a bigger change — make sure this is what you want.',
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
          className="text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          ← Back
        </button>
        <h2 className="mt-1 text-xl font-bold text-warm-800">Ready to go?</h2>
      </div>

      <div className="card-warm p-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-warm-400 uppercase tracking-wide">App</p>
          <p className="text-base text-warm-800">{app.name}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-warm-400 uppercase tracking-wide">Action</p>
          <p className="text-base font-medium text-warm-800">{command.title}</p>
          <p className="mt-1 text-base text-warm-600">{command.description}</p>
        </div>

        <details className="group">
          <summary className="cursor-pointer text-sm text-warm-400 select-none list-none hover:text-warm-500">
            <span className="group-open:hidden">Show technical details ▸</span>
            <span className="hidden group-open:inline">Hide technical details ▾</span>
          </summary>
          {command.command ? (
            <pre className="mt-2 rounded-xl bg-warm-800 p-3 text-sm text-primary-300 overflow-x-auto">
              {command.command}
            </pre>
          ) : (
            <p className="mt-2 text-sm text-warm-500 italic">
              Multi-step command (reads current value, modifies, writes back)
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
        {isExecuting ? 'Working on it...' : 'Go!'}
      </button>
    </div>
  );
}

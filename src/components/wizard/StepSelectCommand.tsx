import type { AppCategory } from '../../data/types';
import { navigateTo } from '../../lib/router';
import { CommandCard } from '../shared/CommandCard';

interface StepSelectCommandProps {
  app: AppCategory;
}

export function StepSelectCommand({ app }: StepSelectCommandProps) {
  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => navigateTo({})}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to apps
        </button>
        <h2 className="mt-1 text-lg font-semibold text-gray-900">{app.name}</h2>
        <p className="mt-1 text-sm text-gray-500">Select a command to run.</p>
      </div>

      <div className="grid gap-3">
        {app.commands.map((cmd) => (
          <CommandCard
            key={cmd.id}
            command={cmd}
            onClick={() => navigateTo({ appId: app.id, commandId: cmd.id })}
          />
        ))}
      </div>
    </div>
  );
}

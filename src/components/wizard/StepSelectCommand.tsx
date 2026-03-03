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
          className="text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          ← Back
        </button>
        <h2 className="mt-1 text-xl font-bold text-warm-800">{app.name}</h2>
        <p className="mt-1 text-base text-warm-500">What would you like to do?</p>
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

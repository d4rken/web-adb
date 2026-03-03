import type { ReactNode } from 'react';

interface WizardPanelProps {
  children: ReactNode;
}

export function WizardPanel({ children }: WizardPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="mx-auto max-w-xl">
        {children}
      </div>
    </div>
  );
}

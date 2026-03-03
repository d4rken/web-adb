import type { ReactNode } from 'react';

interface TerminalPanelProps {
  children: ReactNode;
}

export function TerminalPanel({ children }: TerminalPanelProps) {
  return (
    <div className="flex flex-1 flex-col border-t border-warm-300 bg-terminal-bg lg:border-l lg:border-t-0">
      <div className="flex items-center gap-2 border-b border-terminal-border bg-terminal-header px-4 py-2">
        <span className="text-xs font-medium text-warm-400">Activity Log</span>
        <span className="text-[10px] text-warm-500">Shows what's happening behind the scenes</span>
      </div>
      <div className="flex-1 min-h-0 p-1">
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

interface TerminalPanelProps {
  children: ReactNode;
}

export function TerminalPanel({ children }: TerminalPanelProps) {
  return (
    <div className="flex flex-1 flex-col border-t border-gray-200 bg-[#1e1e2e] lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
        <div>
          <span className="text-xs font-medium text-gray-400">Terminal</span>
          <span className="ml-2 text-[10px] text-gray-500">Command log — you can ignore this panel</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-1">
        {children}
      </div>
    </div>
  );
}

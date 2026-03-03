import '@xterm/xterm/css/xterm.css';
import type { UseTerminal } from '../../hooks/useTerminal';

interface XTermRendererProps {
  terminalRef: UseTerminal['terminalRef'];
}

export function XTermRenderer({ terminalRef }: XTermRendererProps) {
  return (
    <div
      ref={terminalRef}
      className="h-full min-h-0 [&_.xterm]:h-full [&_.xterm-viewport]:!overflow-y-auto"
    />
  );
}

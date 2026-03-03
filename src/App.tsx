import { useAdbConnection } from './hooks/useAdbConnection';
import { useTerminal } from './hooks/useTerminal';
import { Header } from './components/layout/Header';
import { WizardPanel } from './components/layout/WizardPanel';
import { TerminalPanel } from './components/layout/TerminalPanel';
import { WizardContainer } from './components/wizard/WizardContainer';
import { XTermRenderer } from './components/terminal/XTermRenderer';

export default function App() {
  const { state, connect, disconnect, resetKey, execute } = useAdbConnection();
  const { terminalRef, writeln } = useTerminal();

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
      <Header state={state} />

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <WizardPanel>
          <WizardContainer
            connectionState={state}
            onConnect={connect}
            onDisconnect={disconnect}
            onResetKey={resetKey}
            execute={execute}
            writeln={writeln}
          />
        </WizardPanel>

        <div className="h-64 lg:h-auto lg:w-[480px] shrink-0 flex flex-col">
          <TerminalPanel>
            <XTermRenderer terminalRef={terminalRef} />
          </TerminalPanel>
        </div>
      </div>
    </div>
  );
}

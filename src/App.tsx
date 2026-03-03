import { useAdbConnection } from './hooks/useAdbConnection';
import { useTerminal } from './hooks/useTerminal';
import { usePtySession } from './hooks/usePtySession';
import { Header } from './components/layout/Header';
import { WizardPanel } from './components/layout/WizardPanel';
import { TerminalPanel } from './components/layout/TerminalPanel';
import { WizardContainer } from './components/wizard/WizardContainer';
import { XTermRenderer } from './components/terminal/XTermRenderer';
import { SupportFooter } from './components/shared/SupportFooter';

export default function App() {
  const { state, connect, disconnect, resetKey, execute } = useAdbConnection();
  const { terminalRef, terminal, fitAddon, writeln } = useTerminal();
  usePtySession(state, terminal, fitAddon);

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
      <Header state={state} onDisconnect={disconnect} />

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
          <SupportFooter />
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

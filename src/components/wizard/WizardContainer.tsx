import { useState, useEffect, useCallback, useRef } from 'react';
import type { ConnectionState } from '../../adb/types';
import type { Route } from '../../lib/router';
import { parseHash } from '../../lib/router';
import { findApp, findCommand } from '../../data/registry';
import { StepConnect } from './StepConnect';
import { StepSelectApp } from './StepSelectApp';
import { StepSelectCommand } from './StepSelectCommand';
import { StepReview } from './StepReview';
import { StepResult } from './StepResult';

interface WizardContainerProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  onResetKey: () => void;
  execute: (command: string, signal?: AbortSignal) => Promise<string>;
  writeln: (text: string) => void;
}

type ExecutionResult = { success: boolean; output: string } | null;

const stepLabels = ['Connect', 'Select App', 'Select Command', 'Review', 'Result'];

export function WizardContainer({
  connectionState,
  onConnect,
  onDisconnect,
  onResetKey,
  execute,
  writeln,
}: WizardContainerProps) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [result, setResult] = useState<ExecutionResult>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash));
      setResult(null);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Clear result when disconnected
  useEffect(() => {
    if (connectionState.status === 'disconnected') {
      setResult(null);
    }
  }, [connectionState.status]);

  const handleExecute = useCallback(async () => {
    const match = route.appId && route.commandId
      ? findCommand(route.appId, route.commandId)
      : undefined;
    if (!match) return;

    setIsExecuting(true);
    setResult(null);
    abortRef.current = new AbortController();

    try {
      writeln(`\x1b[36m$ adb shell\x1b[0m`);

      const run = async (cmd: string) => {
        writeln(`\x1b[33m> ${cmd}\x1b[0m`);
        const r = await execute(cmd, abortRef.current!.signal);
        writeln(r);
        return r;
      };

      // Pre-flight check
      if (match.command.check) {
        const check = await match.command.check(run);
        if (!check.proceed) {
          writeln(`\x1b[36m⏭ Skipped: ${check.message}\x1b[0m\n`);
          setResult({ success: true, output: check.message });
          return;
        }
      }

      let output: string;
      if (match.command.execute) {
        output = await match.command.execute(run);
      } else if (match.command.command) {
        output = await run(match.command.command);
      } else {
        output = 'No command to execute';
      }

      writeln(`\x1b[32m✓ Done\x1b[0m\n`);
      setResult({ success: true, output });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      writeln(`\x1b[31m✗ ${message}\x1b[0m\n`);
      setResult({ success: false, output: message });
    } finally {
      setIsExecuting(false);
      abortRef.current = null;
    }
  }, [route, execute, writeln]);

  // Derive active step
  const isConnected = connectionState.status === 'connected';

  let activeStep: number;
  if (!isConnected) {
    activeStep = 0;
  } else if (result) {
    activeStep = 4;
  } else if (route.appId && route.commandId && findCommand(route.appId, route.commandId)) {
    activeStep = 3;
  } else if (route.appId && findApp(route.appId)) {
    activeStep = 2;
  } else {
    activeStep = 1;
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i <= activeStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <p className={`mt-1 text-xs text-center ${i === activeStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Step content */}
      {activeStep === 0 && (
        <StepConnect state={connectionState} onConnect={onConnect} onResetKey={onResetKey} />
      )}
      {activeStep === 1 && <StepSelectApp />}
      {activeStep === 2 && route.appId && findApp(route.appId) && (
        <StepSelectCommand app={findApp(route.appId)!} />
      )}
      {activeStep === 3 && route.appId && route.commandId && findCommand(route.appId, route.commandId) && (
        <StepReview
          app={findCommand(route.appId, route.commandId)!.app}
          command={findCommand(route.appId, route.commandId)!.command}
          onExecute={handleExecute}
          isExecuting={isExecuting}
        />
      )}
      {activeStep === 4 && result && (
        <StepResult
          success={result.success}
          output={result.output}
          appId={route.appId}
          onDisconnect={onDisconnect}
        />
      )}
    </div>
  );
}

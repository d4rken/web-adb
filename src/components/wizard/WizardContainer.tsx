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
import { useTranslation } from 'react-i18next';

interface WizardContainerProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  onResetKey: () => void;
  execute: (command: string, signal?: AbortSignal) => Promise<string>;
  writeln: (text: string) => void;
}

type ExecutionResult = { success: boolean; output: string } | null;

export function WizardContainer({
  connectionState,
  onConnect,
  onDisconnect,
  onResetKey,
  execute,
  writeln,
}: WizardContainerProps) {
  const { t } = useTranslation();
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [result, setResult] = useState<ExecutionResult>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stepLabels = [t('steps.connect'), t('steps.pickApp'), t('steps.chooseAction'), t('steps.review'), t('steps.done')];

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
      writeln(`\x1b[36m${t('terminal.adbShell')}\x1b[0m`);

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
          const translatedMessage = t(check.message);
          writeln(`\x1b[36m${t('terminal.skipped', { message: translatedMessage })}\x1b[0m\n`);
          setResult({ success: true, output: translatedMessage });
          return;
        }
      }

      let output: string;
      if (match.command.execute) {
        output = await match.command.execute(run);
      } else if (match.command.command) {
        output = await run(match.command.command);
      } else {
        output = t('error.noCommand');
      }

      writeln(`\x1b[32m${t('terminal.done')}\x1b[0m\n`);
      setResult({ success: true, output });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      writeln(`\x1b[31m✗ ${message}\x1b[0m\n`);
      setResult({ success: false, output: message });
    } finally {
      setIsExecuting(false);
      abortRef.current = null;
    }
  }, [route, execute, writeln, t]);

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
    <div className="space-y-6">
      {/* Progress stepper */}
      <div>
        <div className="flex items-center">
          {stepLabels.map((_, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  i < activeStep
                    ? 'bg-primary-500 text-white'
                    : i === activeStep
                      ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                      : 'bg-warm-200 text-warm-400'
                }`}
              >
                {i < activeStep ? '✓' : i + 1}
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 transition-colors ${i < activeStep ? 'bg-primary-500' : 'bg-warm-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <span className={`text-xs ${i === activeStep ? 'text-primary-600 font-semibold' : 'text-warm-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div key={activeStep} className="animate-slide-up">
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
    </div>
  );
}

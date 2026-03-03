import { useEffect, useRef } from 'react';
import type { Terminal } from '@xterm/xterm';
import type { FitAddon } from '@xterm/addon-fit';
import type { ConnectionState } from '../adb/types';
import { getAdb, spawnShell, type PtySession } from '../adb/connection';

export function usePtySession(
  state: ConnectionState,
  terminal: React.RefObject<Terminal | null>,
  fitAddon: React.RefObject<FitAddon | null>,
): void {
  const sessionRef = useRef<PtySession | null>(null);
  const cleaningUp = useRef(false);

  useEffect(() => {
    if (state.status !== 'connected') return;

    const adb = getAdb();
    if (!adb) return;

    const term = terminal.current;
    if (!term) return;

    let cancelled = false;
    const disposables: Array<{ dispose(): void }> = [];

    async function start() {
      const pty = await spawnShell(adb!);
      if (cancelled) {
        pty.kill();
        return;
      }
      sessionRef.current = pty;

      // Output: PTY → terminal
      const reader = pty.output.getReader();
      (async () => {
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done || cancelled) break;
            term!.write(value);
          }
        } catch {
          // Stream closed on disconnect — expected
        }
      })();

      // Input: terminal keystrokes → PTY
      const encoder = new TextEncoder();
      const writer = pty.input.getWriter();
      disposables.push(
        term!.onData((data) => {
          writer.write(encoder.encode(data)).catch(() => {});
        }),
      );

      // Resize: terminal → PTY (shell protocol only)
      if (pty.resize) {
        const resizeFn = pty.resize;
        disposables.push(
          term!.onResize(({ rows, cols }) => {
            resizeFn(rows, cols).catch(() => {});
          }),
        );
        // Send initial size
        const fit = fitAddon.current;
        if (fit) {
          const dims = fit.proposeDimensions();
          if (dims?.rows && dims?.cols) {
            resizeFn(dims.rows, dims.cols).catch(() => {});
          }
        }
      }

      // Auto-cleanup when PTY exits
      pty.exited.then(() => {
        if (!cancelled) cleanup();
      }).catch(() => {});
    }

    function cleanup() {
      if (cleaningUp.current) return;
      cleaningUp.current = true;

      cancelled = true;
      for (const d of disposables) d.dispose();
      disposables.length = 0;

      const pty = sessionRef.current;
      if (pty) {
        sessionRef.current = null;
        try { pty.kill(); } catch { /* already dead */ }
      }
      cleaningUp.current = false;
    }

    start().catch(() => {});

    return cleanup;
  }, [state.status, terminal, fitAddon]);
}

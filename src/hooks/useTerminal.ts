import { useRef, useCallback, useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

export interface UseTerminal {
  terminalRef: React.RefObject<HTMLDivElement | null>;
  terminal: React.RefObject<Terminal | null>;
  fitAddon: React.RefObject<FitAddon | null>;
  writeln: (text: string) => void;
  write: (text: string) => void;
  clear: () => void;
}

export function useTerminal(): UseTerminal {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // StrictMode-safe: only init once per container
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
      theme: {
        background: '#1e1e2e',
        foreground: '#cdd6f4',
        cursor: '#f5e0dc',
        selectionBackground: '#585b7066',
      },
      convertEol: true,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();

    termRef.current = term;
    fitRef.current = fit;

    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      term.dispose();
      termRef.current = null;
      fitRef.current = null;
      initialized.current = false;
    };
  }, []);

  const writeln = useCallback((text: string) => {
    termRef.current?.writeln(text);
  }, []);

  const write = useCallback((text: string) => {
    termRef.current?.write(text);
  }, []);

  const clear = useCallback(() => {
    termRef.current?.clear();
  }, []);

  return { terminalRef: containerRef, terminal: termRef, fitAddon: fitRef, writeln, write, clear };
}

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ConnectionState } from '../adb/types';
import type { Adb } from '@yume-chan/adb';
import {
  autoReconnect,
  requestAndConnect,
  getDeviceInfo,
  disconnect as adbDisconnect,
  executeCommand,
  getAdb,
} from '../adb/connection';
import { resetCredentialStore } from '../adb/credential-store';

export interface UseAdbConnection {
  state: ConnectionState;
  adb: Adb | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  resetKey: () => void;
  execute: (command: string, signal?: AbortSignal) => Promise<string>;
}

export function useAdbConnection(): UseAdbConnection {
  const [state, setState] = useState<ConnectionState>({ status: 'disconnected' });
  const adbRef = useRef<Adb | null>(null);
  const triedAutoReconnect = useRef(false);

  const finishConnect = useCallback(async (adb: Adb) => {
    adbRef.current = adb;

    // Listen for disconnection
    adb.transport.disconnected.then(() => {
      if (adbRef.current === adb) {
        adbRef.current = null;
        setState({ status: 'disconnected' });
      }
    });

    // Post-connect preflight
    const info = await getDeviceInfo(adb);
    setState({
      status: 'connected',
      deviceName: info.deviceName,
      androidVersion: info.androidVersion,
    });
  }, []);

  // Auto-reconnect on mount
  useEffect(() => {
    if (triedAutoReconnect.current) return;
    triedAutoReconnect.current = true;

    autoReconnect().then((adb) => {
      if (adb) finishConnect(adb);
    }).catch(() => {
      // Silent fail for auto-reconnect
    });
  }, [finishConnect]);

  const connect = useCallback(async () => {
    try {
      setState({ status: 'requesting-device' });
      const adb = await requestAndConnect();
      await finishConnect(adb);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // User cancelled the picker — not an error
      if (message.includes('No device selected')) {
        setState({ status: 'disconnected' });
        return;
      }

      let detail: string | undefined;
      if (message.includes('Unable to claim interface')) {
        detail = 'Close Android Studio, other ADB clients, or browser tabs using this device, then retry.';
      } else if (message.includes('timed out')) {
        detail = 'Make sure to tap "Allow" on the USB debugging prompt on your phone.';
      }

      setState({ status: 'error', error: message, detail });
    }
  }, [finishConnect]);

  const disconnect = useCallback(async () => {
    await adbDisconnect();
    adbRef.current = null;
    setState({ status: 'disconnected' });
  }, []);

  const resetKey = useCallback(() => {
    resetCredentialStore();
  }, []);

  const execute = useCallback(async (command: string, signal?: AbortSignal) => {
    const adb = adbRef.current ?? getAdb();
    if (!adb) throw new Error('Not connected');
    return executeCommand(adb, command, signal);
  }, []);

  return {
    state,
    adb: adbRef.current,
    connect,
    disconnect,
    resetKey,
    execute,
  };
}

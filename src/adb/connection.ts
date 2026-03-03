import { Adb, AdbDaemonTransport, ADB_DEFAULT_AUTHENTICATORS } from '@yume-chan/adb';
import { AdbDaemonWebUsbDeviceManager, type AdbDaemonWebUsbDevice } from '@yume-chan/adb-daemon-webusb';
import { getCredentialStore } from './credential-store';
import { AUTH_TIMEOUT_MS, COMMAND_TIMEOUT_MS } from '../lib/constants';

let currentAdb: Adb | null = null;

export function isWebUsbSupported(): boolean {
  return AdbDaemonWebUsbDeviceManager.BROWSER != null;
}

export function isSecureContext(): boolean {
  return window.isSecureContext;
}

export function getAdb(): Adb | null {
  return currentAdb;
}

export interface DeviceInfo {
  deviceName: string;
  androidVersion: string;
}

export async function autoReconnect(): Promise<Adb | null> {
  const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
  if (!manager) return null;

  const devices = await manager.getDevices();
  if (devices.length === 0) return null;

  return connectDevice(devices[0]);
}

export async function requestDevice(): Promise<AdbDaemonWebUsbDevice> {
  const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
  if (!manager) throw new Error('WebUSB is not supported in this browser.');

  const device = await manager.requestDevice();
  if (!device) throw new Error('No device selected.');

  return device;
}

export async function connectDevice(device: AdbDaemonWebUsbDevice): Promise<Adb> {
  const connection = await device.connect();

  const transport = await withTimeout(
    AdbDaemonTransport.authenticate({
      serial: device.serial,
      connection,
      credentialStore: getCredentialStore(),
      authenticators: [...ADB_DEFAULT_AUTHENTICATORS],
    }),
    AUTH_TIMEOUT_MS,
    'Authentication timed out. Make sure to tap "Allow" on the USB debugging prompt on your phone.',
  );

  const adb = new Adb(transport);
  currentAdb = adb;

  // Listen for disconnection
  adb.transport.disconnected.then(() => {
    if (currentAdb === adb) {
      currentAdb = null;
    }
  });

  return adb;
}

export async function getDeviceInfo(adb: Adb): Promise<DeviceInfo> {
  const [deviceName, androidVersion] = await Promise.all([
    adb.getProp('ro.product.model'),
    adb.getProp('ro.build.version.release'),
  ]);
  return {
    deviceName: deviceName || 'Unknown device',
    androidVersion: androidVersion || '?',
  };
}

export async function executeCommand(
  adb: Adb,
  command: string,
  signal?: AbortSignal,
): Promise<string> {
  const shellProtocol = adb.subprocess.shellProtocol;
  if (shellProtocol) {
    const result = await withTimeout(
      shellProtocol.spawnWaitText(command),
      COMMAND_TIMEOUT_MS,
      `Command timed out after ${COMMAND_TIMEOUT_MS / 1000}s`,
      signal,
    );
    if (result.exitCode !== 0 && result.stderr) {
      throw new Error(result.stderr.trim() || `Command failed with exit code ${result.exitCode}`);
    }
    return (result.stdout + result.stderr).trim();
  }

  // Fallback to none protocol
  const result = await withTimeout(
    adb.subprocess.noneProtocol.spawnWaitText(command),
    COMMAND_TIMEOUT_MS,
    `Command timed out after ${COMMAND_TIMEOUT_MS / 1000}s`,
    signal,
  );
  return result.trim();
}

export async function disconnect(): Promise<void> {
  if (currentAdb) {
    await currentAdb.close();
    currentAdb = null;
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string,
  signal?: AbortSignal,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);

    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('Cancelled'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    promise.then(
      (value) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        reject(err);
      },
    );
  });
}

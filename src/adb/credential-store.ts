import AdbWebCredentialStore from '@yume-chan/adb-credential-web';

let store: AdbWebCredentialStore | null = null;

export function getCredentialStore(): AdbWebCredentialStore {
  if (!store) {
    store = new AdbWebCredentialStore('adb-web-helper');
  }
  return store;
}

export function resetCredentialStore(): void {
  // Clear IndexedDB store by creating a fresh one
  // The old keys become inaccessible
  store = null;
  // Also clear any cached data in IndexedDB
  indexedDB.deleteDatabase('AdbWebCredentialStore');
}

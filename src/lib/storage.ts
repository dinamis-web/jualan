/**
 * Storage adapter interface to prevent coupling UI components directly to localStorage.
 * Supports MemoryStorage for SSR/tests/clean sessions and LocalStorageAdapter with fallback.
 */

export interface IStorageAdapter {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

class MemoryStorageAdapter implements IStorageAdapter {
  private store = new Map<string, unknown>();

  getItem<T>(key: string): T | null {
    const value = this.store.get(key);
    return value !== undefined ? (value as T) : null;
  }

  setItem<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

class LocalStorageAdapter implements IStorageAdapter {
  private fallback = new MemoryStorageAdapter();

  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return this.fallback.getItem<T>(key);
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[storage] Failed to parse storage key "${key}":`, e);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      this.fallback.setItem<T>(key, value);
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[storage] Failed to write storage key "${key}":`, e);
      this.fallback.setItem<T>(key, value);
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable()) {
      this.fallback.removeItem(key);
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      this.fallback.removeItem(key);
    }
  }

  clear(): void {
    if (!this.isAvailable()) {
      this.fallback.clear();
      return;
    }
    try {
      window.localStorage.clear();
    } catch {
      this.fallback.clear();
    }
  }
}

export const appStorage: IStorageAdapter = new LocalStorageAdapter();
export const memoryStorage: IStorageAdapter = new MemoryStorageAdapter();

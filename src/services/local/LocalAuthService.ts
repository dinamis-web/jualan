import { IAuthService } from '../contracts/IAuthService';
import { User } from '../../types/models';
import { appStorage } from '../../lib/storage';

const AUTH_STORAGE_KEY = 'dinamis_auth_user';

export class LocalAuthService implements IAuthService {
  private listeners: Array<(user: User | null) => void> = [];

  private defaultDemoUser: User = {
    id: 'demo-user-01',
    email: 'demo@dinamis.money',
    name: 'Sales Champion',
    role: 'owner',
    isDemo: true,
    createdAt: new Date().toISOString(),
  };

  async getCurrentUser(): Promise<User | null> {
    const saved = appStorage.getItem<User>(AUTH_STORAGE_KEY);
    if (saved) return saved;
    // Default to demo user
    appStorage.setItem(AUTH_STORAGE_KEY, this.defaultDemoUser);
    return this.defaultDemoUser;
  }

  async signInDemo(userName = 'Sales Champion'): Promise<User> {
    const user: User = {
      ...this.defaultDemoUser,
      name: userName,
    };
    appStorage.setItem(AUTH_STORAGE_KEY, user);
    this.notify(user);
    return user;
  }

  async signInWithEmail(email: string): Promise<{ error: string | null }> {
    const user: User = {
      id: 'usr-' + Date.now(),
      email,
      name: email.split('@')[0],
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    appStorage.setItem(AUTH_STORAGE_KEY, user);
    this.notify(user);
    return { error: null };
  }

  async signOut(): Promise<void> {
    appStorage.removeItem(AUTH_STORAGE_KEY);
    this.notify(null);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify(user: User | null) {
    this.listeners.forEach((cb) => cb(user));
  }
}

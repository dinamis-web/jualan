import { User } from '../../types/models';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
}

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  signInDemo(userName?: string): Promise<User>;
  signInWithEmail(email: string): Promise<{ error: string | null }>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}

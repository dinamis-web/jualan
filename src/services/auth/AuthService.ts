import { IAuthService } from '../contracts/IAuthService';
import { User } from '../../types/models';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabaseClient';
import { LocalAuthService } from '../local/LocalAuthService';

export class AuthService implements IAuthService {
  private localService = new LocalAuthService();

  async getCurrentUser(): Promise<User | null> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) {
      return this.localService.getCurrentUser();
    }

    try {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        return this.localService.getCurrentUser();
      }
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
        avatarUrl: data.user.user_metadata?.avatar_url,
        isDemo: false,
        createdAt: data.user.created_at,
      };
    } catch {
      return this.localService.getCurrentUser();
    }
  }

  async signInDemo(userName = 'Sales Champion'): Promise<User> {
    return this.localService.signInDemo(userName);
  }

  async signInWithEmail(email: string): Promise<{ error: string | null }> {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) {
      return this.localService.signInWithEmail(email);
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      return { error: error?.message || null };
    } catch (err: any) {
      return { error: err?.message || 'Gagal mengirim link autentikasi' };
    }
  }

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout failed', e);
      }
    }
    await this.localService.signOut();
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured) {
      return this.localService.onAuthStateChange(callback);
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url,
          isDemo: false,
          createdAt: session.user.created_at,
        });
      } else {
        callback(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }
}

export const authService = new AuthService();

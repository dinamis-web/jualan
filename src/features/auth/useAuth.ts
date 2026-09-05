import { useState, useEffect, useCallback } from 'react';
import { User } from '../../types/models';
import { authService } from '../../services';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authService.getCurrentUser().then((initialUser) => {
      if (isMounted) {
        setUser(initialUser);
        setIsLoading(false);
      }
    });

    const unsubscribe = authService.onAuthStateChange((updatedUser) => {
      if (isMounted) {
        setUser(updatedUser);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signInDemo = useCallback(async (userName?: string) => {
    setIsLoading(true);
    const u = await authService.signInDemo(userName);
    setUser(u);
    setIsLoading(false);
    return u;
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    return authService.signInWithEmail(email);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    isDemo: Boolean(user?.isDemo),
    signInDemo,
    signInWithEmail,
    signOut,
  };
}

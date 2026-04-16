import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Database['public']['Tables']['profiles']['Update']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Prevent double-firing onAuthStateChange on initial load
  const initialLoadDone = useRef(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) setProfile(data);
    } catch {
      // Profile fetch failure should never block the app
    }
  };

  useEffect(() => {
    // ── Step 1: Restore session instantly from localStorage (fast, no network) ──
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false); // Unblock UI immediately — don't wait for profile
      initialLoadDone.current = true;
      if (session?.user) {
        // Fetch profile in background — won't block navigation
        fetchProfile(session.user.id);
      }
    }).catch(() => {
      // Even on error, always unblock the UI
      setLoading(false);
      initialLoadDone.current = true;
    });

    // ── Step 2: Listen for future auth changes (sign in, sign out, token refresh) ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Skip the INITIAL_SESSION event — already handled above
        if (!initialLoadDone.current) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Load profile in background — non-blocking
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          // Skip Google account picker if already signed in — faster UX
          prompt: 'select_account',
        },
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Database['public']['Tables']['profiles']['Update']) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    if (data) setProfile(data);
  };

  return (
    <AuthContext.Provider value={{
      session, user, profile, loading,
      signInWithGoogle, signInWithEmail, signUpWithEmail,
      signOut, updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

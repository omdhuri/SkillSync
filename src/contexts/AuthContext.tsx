import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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

  const fetchProfile = async (userId: string, authMeta?: Record<string, string>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return;

      const realName = authMeta?.full_name || authMeta?.name;
      const realAvatar = authMeta?.avatar_url || authMeta?.picture;

      const hasStaleData = (realName && data.full_name !== realName) || 
                           data.full_name === 'Felix Developer' || 
                           data.full_name === 'Felix';

      if (hasStaleData) {
        const updates: Record<string, string> = {};
        // If they have no real name from auth, and name is Felix, wipe it to ''
        updates.full_name = realName || (data.full_name.includes('Felix') ? '' : data.full_name);
        
        if (realAvatar && data.avatar_url !== realAvatar) updates.avatar_url = realAvatar;
        // Fire-and-forget background update — never blocks UI
        supabase.from('profiles').update(updates).eq('id', userId).then(() => {});
        setProfile({ ...data, ...updates });
      } else {
        setProfile(data);
      }
    } catch {
      // Silently ignore — never block the app for a profile fetch failure
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Manually fetch the session immediately with a guaranteed fail-safe timeout.
    // If Supabase's local storage lock hangs in production (known issue in some browsers),
    // this timeout will force the UI to unblock after 2 seconds.
    async function getInitialSession() {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved && mounted) {
           console.warn('[SkillSync Auth] Supabase getSession timed out. Forcing UI unblock.');
           setLoading(false);
        }
      }, 2000);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        resolved = true;
        clearTimeout(timeout);
        
        if (mounted) {
          if (error) console.error('[SkillSync Auth] getSession error:', error);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false); // Resolve loading safely
          
          if (session?.user) {
            fetchProfile(session.user.id, session.user.user_metadata as Record<string, string>);
          }
        }
      } catch (err) {
        resolved = true;
        clearTimeout(timeout);
        console.error('[SkillSync Auth] getSession crashed:', err);
        if (mounted) setLoading(false);
      }
    }
    
    getInitialSession();

    // 2. Listen for any future events (login, logout, token refresh).
    // This perfectly works alongside getInitialSession without racing.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          fetchProfile(session.user.id, session.user.user_metadata as Record<string, string>);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { prompt: 'select_account' },
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
      signOut, updateProfile,
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

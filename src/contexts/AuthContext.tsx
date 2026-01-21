import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AccessLevel = 'public' | 'professional' | 'restricted';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  accessLevel: AccessLevel;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasAccess: (requiredLevel: AccessLevel) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('public');
  const [loading, setLoading] = useState(true);

  const fetchAccessLevel = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('access_level')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data && !error) {
      setAccessLevel(data.access_level as AccessLevel);
    } else {
      setAccessLevel('public');
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase call with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchAccessLevel(session.user.id);
          }, 0);
        } else {
          setAccessLevel('public');
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchAccessLevel(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAccessLevel('public');
  };

  const hasAccess = (requiredLevel: AccessLevel): boolean => {
    const levels: AccessLevel[] = ['public', 'professional', 'restricted'];
    return levels.indexOf(accessLevel) >= levels.indexOf(requiredLevel);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        accessLevel,
        loading,
        signIn,
        signUp,
        signOut,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { supabase } = await import('@/lib/supabase/client');
    return supabase.auth.signInWithPassword(credentials);
  },
  
  signup: async (credentials: { email: string; password: string; full_name?: string }) => {
    const { supabase } = await import('@/lib/supabase/client');
    return supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.full_name,
        }
      }
    });
  },
  
  logout: async () => {
    const { supabase } = await import('@/lib/supabase/client');
    return supabase.auth.signOut();
  },
  
  getUser: async () => {
    const { supabase } = await import('@/lib/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

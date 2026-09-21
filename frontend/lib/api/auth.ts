import { apiClient } from './client';

export const authApi = {
  login: async (credentials: any) => {
    const { supabase } = await import('@/lib/supabase/client');
    return supabase.auth.signInWithPassword(credentials);
  },
  
  signup: async (credentials: any) => {
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

import { create } from 'zustand';
import supabase from '../lib/supabase';

const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  setSession: (session) => set({
    session,
    user: session?.user ?? null,
    loading: false,
  }),

  clearAuth: () => set({ session: null, user: null, loading: false }),
}));

// Hydrate from existing session on page load
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
});

// Keep store in sync with Supabase auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});

export default useAuthStore;

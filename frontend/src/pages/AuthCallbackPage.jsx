import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? '/dashboard' : '/login', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <p className="text-white/50 text-sm">Signing you in…</p>
    </div>
  );
}

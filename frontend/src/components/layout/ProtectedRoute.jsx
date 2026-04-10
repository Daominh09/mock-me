import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex items-center justify-center">
        <p className="text-white/50 text-sm">Loading…</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

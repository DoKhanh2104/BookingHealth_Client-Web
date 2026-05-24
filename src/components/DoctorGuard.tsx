import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DoctorGuard: React.FC = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated and has DOCTOR role
  const isDoctor = isAuthenticated && (role?.includes('DOCTOR') || role === '3');

  if (!isDoctor) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default DoctorGuard;

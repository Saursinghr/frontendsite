import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // If not logged in or not an admin, redirect to admin login
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // If user is authenticated and is admin, render the protected component
  return <>{children}</>;
}

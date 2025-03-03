import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Use useCallback to memoize the verifyAuth function
  const verifyAuth = useCallback(async () => {
    // Skip if already authenticated
    if (isAuthenticated) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }
    
    setIsChecking(true);
    const isAuth = await checkAuthStatus();
    setIsAuthorized(isAuth);
    setIsChecking(false);
  }, [checkAuthStatus, isAuthenticated]);

  // Only run the effect once when the component mounts
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  if (isChecking) {
    // You could return a loading spinner here
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized && !isAuthenticated) {
    // Save the current path for redirect after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 
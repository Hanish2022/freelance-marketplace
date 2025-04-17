import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  const { checkAuth, isCheckingAuth, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const isAuthenticated = await checkAuth();
      
      // If user is not authenticated and not on login/signup page, redirect to login
      if (!isAuthenticated && !isCheckingAuth) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/signup') {
          navigate('/login');
        }
      }
    };

    initializeAuth();
  }, [checkAuth, isCheckingAuth, isLoggedIn, navigate]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return children;
};

export default AuthProvider; 
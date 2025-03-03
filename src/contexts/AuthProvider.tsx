import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

interface User {
  username: string;
  full_name: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  checkAuthStatus: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Use useCallback to memoize the checkAuthStatus function
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      
      if (!storedToken || !storedUser) {
        return false;
      }
      
      // Set token in state and axios headers
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Parse user data
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Optional: Verify token with backend
      // This would be a lightweight API call to validate the token
      // const response = await axios.get('http://localhost:5002/verify-token');
      // return response.status === 200;
      
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Initialize auth state only once when the component mounts
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    initAuth();
    // Empty dependency array ensures this only runs once
  }, []);

  // Handle redirects for protected routes
  useEffect(() => {
    // Skip if still loading or if already authenticated
    if (isLoading || isAuthenticated) return;
    
    const protectedRoutes = ['/documents', '/users'];
    
    if (protectedRoutes.includes(location.pathname)) {
      // Save the attempted URL for redirecting after login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate, isLoading]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5002/login', 
        new URLSearchParams({
          'username': username,
          'password': password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token } = response.data;
      
      // Create a user object (in a real app, you might want to fetch user details)
      const userObj: User = {
        username,
        full_name: username // This would normally come from the API
      };
      
      // Store in state
      setToken(access_token);
      setUser(userObj);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('authUser', JSON.stringify(userObj));
      
      // Set default Authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Check if there's a saved redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('redirectAfterLogin');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token, 
      login, 
      logout,
      checkAuthStatus
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}; 
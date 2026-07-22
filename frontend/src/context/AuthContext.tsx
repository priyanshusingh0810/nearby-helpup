import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface UserType {
  id: number;
  email: string;
  username: string;
  name: string;
  bio: string;
  profile_photo: string;
  location_lat: number | null;
  location_lon: number | null;
  location_name: string;
  college: string;
  phone_verified: boolean;
  identity_verified: boolean;
  trust_score: number;
  total_ratings: number;
  average_rating: number;
  created_at: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  googleSignIn: (googleProfile: any) => Promise<void>;
  phoneSignIn: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserCoords: (lat: number, lon: number, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await api.auth.getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user session', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.auth.login(emailOrUsername, password);
      localStorage.setItem('token', response.access_token);
      await fetchUser();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (userData: any) => {
    setLoading(true);
    try {
      const response = await api.auth.signup(userData);
      localStorage.setItem('token', response.access_token);
      await fetchUser();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const googleSignIn = async (googleProfile: any) => {
    setLoading(true);
    try {
      const response = await api.auth.googleLogin(googleProfile);
      localStorage.setItem('token', response.access_token);
      await fetchUser();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const phoneSignIn = async (phone: string, otp: string) => {
    setLoading(true);
    try {
      const response = await api.auth.phoneLogin(phone, otp);
      localStorage.setItem('token', response.access_token);
      await fetchUser();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    try {
      const userData = await api.auth.getMe();
      setUser(userData);
    } catch (err) {
      console.error('Could not refresh user details', err);
    }
  };

  const updateUserCoords = async (lat: number, lon: number, name: string) => {
    if (!user) return;
    try {
      const updated = await api.profiles.updateMe({
        location_lat: lat,
        location_lon: lon,
        location_name: name,
      });
      setUser(updated);
    } catch (err) {
      console.error('Could not update position coordinates', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleSignIn,
        phoneSignIn,
        logout,
        refreshUser,
        updateUserCoords,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export type { UserType };

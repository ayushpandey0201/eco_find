import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import LandingPage from '../pages/LandingPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import SellItemPage from '../pages/SellItemPage';
import ChatPage from '../pages/ChatPage';
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Google OAuth callback handler
const GoogleCallback = () => {
  const location = useLocation();
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      console.log('✅ Token received from Google OAuth');
      
      // Store the token
      localStorage.setItem('authToken', token);
      
      // Fetch user data using the token
      fetch('http://localhost:8080/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('✅ User authenticated successfully');
          localStorage.setItem('secondchance_user', JSON.stringify(data.user));
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          console.error('❌ Failed to get user data:', data);
        }
      })
      .catch(error => {
        console.error('❌ Error fetching user data:', error);
      });
    } else {
      console.error('❌ No token found in URL');
    }
  }, [location, setUser, setIsAuthenticated]);

  // Show the LandingPage directly
  return <LandingPage />;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } 
      />
      
      {/* Google OAuth Callback Route */}
      <Route path="/landing" element={<GoogleCallback />} />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/product/:id" 
        element={
          <ProtectedRoute>
            <ProductDetailsPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/sell" 
        element={
          <ProtectedRoute>
            <SellItemPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/chat/:productId?" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
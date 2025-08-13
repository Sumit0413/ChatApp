import React, { useState, useEffect } from 'react'
import Login from './Pages/Login'
import Register from './Pages/Register'
import axios from 'axios'
import {Route, Routes, Navigate} from 'react-router-dom'
import ChatApp from './Pages/Home'
import { SocketProvider } from './context/SocketContext.jsx'


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

  // Check if user is authenticated when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/v1/user/me`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setCurrentUser(response.data);
      } catch  {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [apiBaseUrl]);

  // Function to refresh authentication status
  const refreshAuth = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiBaseUrl}/api/v1/user/me`, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setCurrentUser(response.data);
    } catch {
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <SocketProvider user={currentUser}>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Register onSuccess={refreshAuth} />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Login onSuccess={refreshAuth} />} 
        />
        <Route 
          path="/home" 
          element={isAuthenticated ? <ChatApp onLogout={refreshAuth} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </SocketProvider>
  )
}

export default App
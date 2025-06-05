import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import UserLoginPage from './Loginpage';
import ProtectedRoute from './Protecteroute';

function App() {
  const token = localStorage.getItem('jwtToken');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? '/home' : '/login'} replace />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/home" replace /> : <UserLoginPage />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
 
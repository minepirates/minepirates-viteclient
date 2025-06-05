import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function UserLoginPage() {
  const [code, setCode] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fingerprint, setFingerprint] = useState('');

  const navigate = useNavigate();

  // Load fingerprint and verify token on mount
  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);

      // Auto verify on load
      if (token) {
        await verifyToken(result.visitorId);
      }
    };
    loadFingerprint();
  }, []);

  // Redirect to /home if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { code, fingerprint });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsLoggedIn(true); // triggers redirect to /home
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (fp) => {
    try {
      await axios.post(`${API_BASE_URL}/verify`, { token, fingerprint: fp });
      setIsLoggedIn(true);
    } catch {
      localStorage.removeItem('token');
      setToken('');
    }
  };

  return (
    <div style={styles.container}>
      {!isLoggedIn && (
        <div style={styles.loginCard}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your OTP to continue</p>
          
          <input
            type="text"
            placeholder="Enter OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleLogin()}
          />
          
         <button 
  onClick={handleLogin} 
  disabled={loading || !code.trim()}  // disable if loading or code is empty
  style={{
    ...styles.button,
    ...(loading || !code.trim() ? styles.buttonDisabled : styles.buttonActive)
  }}
>
  {loading ? 'Logging in...' : 'Login'}
</button>

        </div>
      )}
      
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('❌') ? styles.errorMessage : styles.successMessage)
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e1a',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
  },
  
  loginCard: {
    backgroundColor: '#0f1419',
    border: '1px solid #2d3748',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 20, 40, 0.6)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  
  subtitle: {
    margin: '0 0 32px 0',
    color: '#64748b',
    fontSize: '16px',
    fontWeight: '400',
  },
  
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    backgroundColor: '#1e2a3a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    marginBottom: '24px',
    boxSizing: 'border-box',
  },
  
  button: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#475569',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  buttonActive: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
  },
  
  buttonDisabled: {
    backgroundColor: '#1e2a3a',
    color: '#475569',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  
  message: {
    marginTop: '24px',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  
  errorMessage: {
    backgroundColor: '#2d1b1b',
    color: '#ff6b6b',
    border: '1px solid #4a2c2c',
  },
  
  successMessage: {
    backgroundColor: '#1b2d1b',
    color: '#51cf66',
    border: '1px solid #2c4a2c',
  },
};

export default UserLoginPage;
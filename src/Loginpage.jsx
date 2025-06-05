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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [fingerprint, setFingerprint] = useState('');
  const navigate = useNavigate();

  // Load fingerprint & verify token on mount
  useEffect(() => {
    const initialize = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);

      if (token) {
        try {
          await axios.post(`${API_BASE_URL}/verify`, {
            token,
            fingerprint: result.visitorId,
          });
          navigate('/home', { replace: true }); // ✅ Already authenticated
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
          localStorage.removeItem('token');
          setToken('');
        }
      }

      setCheckingAuth(false); // Done checking
    };

    initialize();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        code,
        fingerprint,
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/home', { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#94a3b8', fontSize: '18px' }}>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Enter your OTP to continue</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading || !code.trim()}
          style={{
            ...styles.button,
            ...(loading || !code.trim() ? styles.buttonDisabled : styles.buttonActive),
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div
            style={{
              ...styles.message,
              ...(message.includes('❌') ? styles.errorMessage : styles.successMessage),
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0e1a',
    color: '#ffffff',
    display: 'flex',
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
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    backgroundColor: '#1e2a3a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#ffffff',
    marginBottom: '24px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textTransform: 'uppercase',
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
  },
  message: {
    marginTop: '24px',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
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

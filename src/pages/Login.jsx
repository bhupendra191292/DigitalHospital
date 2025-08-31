import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setDoctor, setToken, setRole, setTenant } from '../store/slices/authSlice';
import { loginDoctor } from '../services/api';
import tenantStylingService from '../services/tenantStylingService';
import PhoneInput from '../components/PhoneInput';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login...');
      const res = await loginDoctor(phone, password);
      console.log('Login response:', res.data);

      Cookies.set('token', res.data.token);
      Cookies.set('role', res.data.doctor.role);
      console.log('Cookies set:', { token: res.data.token, role: res.data.doctor.role });

      dispatch(setDoctor(res.data.doctor));
      dispatch(setToken(res.data.token));
      dispatch(setRole(res.data.doctor.role));
      
      // Set tenant data if available
      if (res.data.tenant) {
        dispatch(setTenant(res.data.tenant));
        // Apply tenant styling
        tenantStylingService.applyTenantStyling(res.data.tenant);
        tenantStylingService.updateTenantInStorage(res.data.tenant);
      }
      
      console.log('Redux state updated');

      // Add success animation
      const button = e.target.querySelector('.login-button');
      if (button) {
        button.classList.add('login-success');
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          navigate('/dashboard');
        }, 600);
      } else {
        navigate('/dashboard');
      }
      
      // Show success message
      const role = res.data.doctor.role === 'admin' ? 'Administrator' : 'Doctor';
      console.log(`Welcome, ${res.data.doctor.name}! Logged in as ${role}`);
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Particle effects */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            🏥
          </div>
          <h1 className="login-title">Digital Hospital</h1>
          <p className="login-subtitle">Secure Healthcare Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              placeholder="Enter your phone number"
              className="login-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="login-checkbox-row">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              id="showPass"
            />
            <label htmlFor="showPass">
              Show Password
            </label>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span style={{ marginLeft: '10px' }}>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {error && <div className="login-error">{error}</div>}
        </form>

        <div className="login-links">
          <Link to="/register" className="register-link">
            🏥 Register Your Hospital/Clinic
          </Link>
          <Link to="/forgot-password" className="forgot-link">
            🔐 Forgot Password?
          </Link>
        </div>

        {/* Demo credentials info */}
        <div className="demo-credentials">
          <strong>Demo Credentials:</strong><br/>
          <strong>Admin:</strong> 9999999999 / Admin@123<br/>
          <strong>Doctor:</strong> 9166677753 / Test@123<br/>
          <strong>Test Hospital:</strong> +1234567890 / admin123
        </div>
      </div>
    </div>
  );
};

export default Login;

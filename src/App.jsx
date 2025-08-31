import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';
import { usePerformance } from './hooks/usePerformance';
import tenantStylingService from './services/tenantStylingService';
import './App.css';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PatientProfile = lazy(() => import('./pages/PatientProfile'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const TenantRegistration = lazy(() => import('./pages/TenantRegistration'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, errorInfo, resetError }) => (
  <div className="error-fallback">
    <div className="error-content">
      <h2>🚨 Application Error</h2>
      <p>Something went wrong with the application. Please try again.</p>
      <div className="error-actions">
        <button onClick={resetError} className="btn btn-primary">
          Try Again
        </button>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">
          Reload Page
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="error-details">
          <summary>Error Details</summary>
          <pre>{error?.message}</pre>
          <pre>{errorInfo?.componentStack}</pre>
        </details>
      )}
    </div>
  </div>
);

// Main App component with performance monitoring
const AppContent = () => {
  // Initialize performance monitoring
  const performance = usePerformance({
    enabled: process.env.NODE_ENV === 'development',
    threshold: 1000,
    onMetric: (metric) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Performance Metric:', metric);
      }
    },
    onThresholdExceeded: (metric) => {
      console.warn('⚠️ Performance threshold exceeded:', metric);
    },
  });

  // Start monitoring on app load
  React.useEffect(() => {
    performance.startMonitoring();
    
    // Initialize tenant styling from storage
    tenantStylingService.initializeFromStorage();
    
    // Stop monitoring on unmount
    return () => {
      performance.stopMonitoring();
    };
  }, [performance]);

  return (
    <ErrorBoundary
      fallback={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('App Error:', error, errorInfo);
        // In production, send to error reporting service
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<TenantRegistration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient/:id" element={<PatientProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

// Root App component
const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary
        fallback={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('Root App Error:', error, errorInfo);
        }}
      >
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;

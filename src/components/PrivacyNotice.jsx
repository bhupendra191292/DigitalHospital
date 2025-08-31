import React from 'react';

const PrivacyNotice = () => {
  return (
    <div className="privacy-notice" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(255, 193, 7, 0.95)',
      color: '#000',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '0.875rem',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      border: '1px solid #ffc107'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span>⚠️</span>
        <strong>Demo System</strong>
      </div>
      <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4' }}>
        This is a demonstration system with sample data only. 
        No real patient information is stored or processed.
      </p>
    </div>
  );
};

export default PrivacyNotice;

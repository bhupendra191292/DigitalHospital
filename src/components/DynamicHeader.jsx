import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tenantStylingService from '../services/tenantStylingService';
import './DynamicHeader.css';

const DynamicHeader = ({ title, subtitle, showHospitalName = true }) => {
  const { tenant } = useSelector(state => state.auth);
  const [hospitalName, setHospitalName] = useState('Digital Hospital');

  useEffect(() => {
    if (tenant?.name) {
      setHospitalName(tenant.name);
      // Apply tenant-specific styling using the service
      tenantStylingService.applyTenantStyling(tenant);
    }
  }, [tenant]);

  return (
    <div className="dynamic-header">
      {showHospitalName && (
        <div className="hospital-branding">
          <div className="hospital-logo">
            {tenant?.logo?.url ? (
              <img 
                src={tenant.logo.url} 
                alt={hospitalName}
                className="logo-image"
              />
            ) : (
              <div className="logo-placeholder">
                🏥
              </div>
            )}
          </div>
          <div className="hospital-info">
            <h1 className="hospital-name">{hospitalName}</h1>
            {tenant?.type && (
              <span className="hospital-type">
                {tenant.type.charAt(0).toUpperCase() + tenant.type.slice(1)}
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="header-content">
        <div className="header-text">
          <h2 className="header-title">{title}</h2>
          {subtitle && (
            <p className="header-subtitle">{subtitle}</p>
          )}
        </div>
        
        {tenant?.uiCustomization?.layouts?.dashboard?.header === 'bottom' && (
          <div className="header-actions">
            <div className="tenant-status">
              <span className={`status-indicator ${tenant?.status || 'active'}`}>
                {tenant?.status || 'active'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicHeader;

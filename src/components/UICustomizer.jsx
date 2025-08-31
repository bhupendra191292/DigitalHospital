import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTenantConfig } from '../services/api';
import tenantStylingService from '../services/tenantStylingService';
import LoadingSpinner from './LoadingSpinner';
import './UICustomizer.css';

const UICustomizer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, tenant } = useSelector(state => state.auth);
  
  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const [customization, setCustomization] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [originalCustomization, setOriginalCustomization] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Initialize customization from tenant data
  useEffect(() => {
    if (tenant?.uiCustomization) {
      const tenantCustomization = JSON.parse(JSON.stringify(tenant.uiCustomization));
      setCustomization(tenantCustomization);
      setOriginalCustomization(tenantCustomization);
      setHasChanges(false);
    } else {
      const emptyCustomization = {};
      setCustomization(emptyCustomization);
      setOriginalCustomization(emptyCustomization);
      setHasChanges(false);
    }
  }, [tenant]);

  // Handle customization changes with proper state management
  const handleCustomizationChange = useCallback((path, value) => {
    try {
      console.log(`🎨 Changing ${path} to ${value}`);
      
      // Create a deep copy of the current customization
      const newCustomization = JSON.parse(JSON.stringify(customization || {}));
      
      // Navigate to the nested property and set the value
      const keys = path.split('.');
      let current = newCustomization;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      // Update state
      setCustomization(newCustomization);
      setHasChanges(true);
      
      // Apply changes immediately if preview mode is on
      if (previewMode) {
        console.log('🔄 Preview mode is ON - applying changes immediately');
        applyPreviewCustomization(newCustomization);
      } else {
        console.log('⏸️ Preview mode is OFF - changes stored but not applied');
      }
    } catch (error) {
      console.error('❌ Error in handleCustomizationChange:', error);
    }
  }, [customization, previewMode]);

  // Apply preview customization
  const applyPreviewCustomization = useCallback((customizationData) => {
    try {
      // Create a temporary tenant object with the new customization
      const tempTenant = {
        ...tenant,
        uiCustomization: customizationData
      };
      
      // Apply the styling using our service
      tenantStylingService.applyTenantStyling(tempTenant);
      
      console.log('✅ Preview customization applied successfully');
    } catch (error) {
      console.error('❌ Error applying preview customization:', error);
    }
  }, [tenant]);

  // Handle preview mode toggle
  const handlePreviewToggle = useCallback(() => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      console.log('🔄 Preview Mode ON - applying current customization');
      applyPreviewCustomization(customization);
    } else {
      console.log('🔄 Preview Mode OFF - reverting to original');
      tenantStylingService.applyTenantStyling({
        ...tenant,
        uiCustomization: originalCustomization
      });
    }
  }, [previewMode, customization, originalCustomization, tenant, applyPreviewCustomization]);

  // Save customization
  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      console.log('💾 Saving customization...');
      
      const response = await updateTenantConfig({
        uiCustomization: customization
      });
      
      if (response.data.success) {
        // Update Redux state
        dispatch({
          type: 'auth/updateTenant',
          payload: { ...tenant, uiCustomization: customization }
        });
        
        // Update original customization
        setOriginalCustomization(JSON.parse(JSON.stringify(customization)));
        setHasChanges(false);
        
        // Apply the customization globally
        tenantStylingService.applyTenantStyling({
          ...tenant,
          uiCustomization: customization
        });
        
        // Update storage
        tenantStylingService.updateTenantInStorage({
          ...tenant,
          uiCustomization: customization
        });
        
        console.log('✅ Customization saved successfully');
        alert('UI customization saved successfully!');
        onClose();
      }
    } catch (error) {
      console.error('❌ Error saving customization:', error);
      alert('Failed to save customization. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [customization, tenant, dispatch, onClose]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    if (confirm('Are you sure you want to reset all customizations to default?')) {
      console.log('🔄 Resetting to defaults');
      
      // Create fresh empty objects
      const emptyCustomization = {};
      setCustomization(emptyCustomization);
      setOriginalCustomization(emptyCustomization);
      setHasChanges(true);
      
      // Reset styling
      tenantStylingService.resetStyling();
      
      // If in preview mode, disable it
      if (previewMode) {
        setPreviewMode(false);
      }
      
      console.log('✅ Reset to defaults completed');
    }
  }, [previewMode]);

  // Cancel changes
  const handleCancel = useCallback(() => {
    console.log('❌ Cancelling changes');
    
    // Revert to original customization with deep copy
    const originalCopy = JSON.parse(JSON.stringify(originalCustomization || {}));
    setCustomization(originalCopy);
    setHasChanges(false);
    
    // Apply original styling
    tenantStylingService.applyTenantStyling({
      ...tenant,
      uiCustomization: originalCustomization
    });
    
    // Disable preview mode
    setPreviewMode(false);
    
    onClose();
  }, [originalCustomization, tenant, onClose]);

  // Get nested value safely
  const getNestedValue = useCallback((obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }, []);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className={`ui-customizer-overlay ${previewMode ? 'preview-mode' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {isMinimized && previewMode ? (
        // Floating button when minimized
        <div style={{
          position: 'fixed',
          top: '120px',
          right: '20px',
          zIndex: 9999
        }}>
          <button
            onClick={() => setIsMinimized(false)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'pulse 2s infinite',
              transition: 'all 0.3s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            🎨 Show Customizer
          </button>
          {showTooltip && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              background: 'rgba(16, 185, 129, 0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '500',
              maxWidth: '200px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 1001,
              whiteSpace: 'nowrap',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              👁️ Full UI view - Changes are live!
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '20px',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(16, 185, 129, 0.9)'
              }}></div>
            </div>
          )}
        </div>
      ) : (
        // Full customizer modal
        <div className={`ui-customizer ${previewMode ? 'preview-mode' : ''}`}>
        <div className="customizer-header">
          <h2>🎨 UI Customization</h2>
          <div className="header-actions">
            <button
              className={`preview-btn ${previewMode ? 'active' : ''}`}
              onClick={handlePreviewToggle}
              style={{
                backgroundColor: previewMode ? '#10b981' : '#6b7280',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              👁️ {previewMode ? 'Preview ON' : 'Preview OFF'}
            </button>
            {previewMode && (
              <button
                className="minimize-btn"
                onClick={() => {
                  setIsMinimized(!isMinimized);
                  if (!isMinimized) {
                    setShowTooltip(true);
                    setTimeout(() => setShowTooltip(false), 4000); // Hide after 4 seconds
                  }
                }}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}
              >
                {isMinimized ? '🔍 Show Customizer' : '📱 Hide Customizer'}
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="customizer-tabs">
          <button
            className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            🎨 Colors
          </button>
          <button
            className={`tab-btn ${activeTab === 'typography' ? 'active' : ''}`}
            onClick={() => setActiveTab('typography')}
          >
            📝 Typography
          </button>
          <button
            className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            📐 Layout
          </button>
          <button
            className={`tab-btn ${activeTab === 'components' ? 'active' : ''}`}
            onClick={() => setActiveTab('components')}
          >
            🧩 Components
          </button>
          <button
            className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            ⚙️ Advanced
          </button>
        </div>

        <div className="customizer-content">
          {previewMode && (
            <div className="preview-instruction" style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
            }}>
              👁️ <strong>Live Preview Active!</strong> You can now see your changes in real-time on the main UI behind this popup.
            </div>
          )}
          
          {activeTab === 'colors' && (
            <div className="tab-content">
              <h3>Color Scheme</h3>
              <div className="color-grid">
                <ColorPicker 
                  label="Primary Color" 
                  path="colors.primary" 
                  defaultValue="#2563eb"
                  value={getNestedValue(customization, 'colors.primary')}
                  onChange={(value) => handleCustomizationChange('colors.primary', value)}
                />
                <ColorPicker 
                  label="Secondary Color" 
                  path="colors.secondary" 
                  defaultValue="#059669"
                  value={getNestedValue(customization, 'colors.secondary')}
                  onChange={(value) => handleCustomizationChange('colors.secondary', value)}
                />
                <ColorPicker 
                  label="Accent Color" 
                  path="colors.accent" 
                  defaultValue="#f59e0b"
                  value={getNestedValue(customization, 'colors.accent')}
                  onChange={(value) => handleCustomizationChange('colors.accent', value)}
                />
                <ColorPicker 
                  label="Success Color" 
                  path="colors.success" 
                  defaultValue="#10b981"
                  value={getNestedValue(customization, 'colors.success')}
                  onChange={(value) => handleCustomizationChange('colors.success', value)}
                />
                <ColorPicker 
                  label="Warning Color" 
                  path="colors.warning" 
                  defaultValue="#f59e0b"
                  value={getNestedValue(customization, 'colors.warning')}
                  onChange={(value) => handleCustomizationChange('colors.warning', value)}
                />
                <ColorPicker 
                  label="Error Color" 
                  path="colors.error" 
                  defaultValue="#ef4444"
                  value={getNestedValue(customization, 'colors.error')}
                  onChange={(value) => handleCustomizationChange('colors.error', value)}
                />
                <ColorPicker 
                  label="Background Color" 
                  path="colors.background" 
                  defaultValue="#ffffff"
                  value={getNestedValue(customization, 'colors.background')}
                  onChange={(value) => handleCustomizationChange('colors.background', value)}
                />
                <ColorPicker 
                  label="Surface Color" 
                  path="colors.surface" 
                  defaultValue="#f8fafc"
                  value={getNestedValue(customization, 'colors.surface')}
                  onChange={(value) => handleCustomizationChange('colors.surface', value)}
                />
                <ColorPicker 
                  label="Text Color" 
                  path="colors.text" 
                  defaultValue="#1f2937"
                  value={getNestedValue(customization, 'colors.text')}
                  onChange={(value) => handleCustomizationChange('colors.text', value)}
                />
                <ColorPicker 
                  label="Secondary Text" 
                  path="colors.textSecondary" 
                  defaultValue="#6b7280"
                  value={getNestedValue(customization, 'colors.textSecondary')}
                  onChange={(value) => handleCustomizationChange('colors.textSecondary', value)}
                />
              </div>
            </div>
          )}

          {/* Add other tabs here - Typography, Layout, Components, Advanced */}
          {activeTab === 'typography' && (
            <div className="tab-content">
              <h3>Typography Settings</h3>
              <p>Typography customization coming soon...</p>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="tab-content">
              <h3>Layout Configuration</h3>
              <p>Layout customization coming soon...</p>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="tab-content">
              <h3>Component Styling</h3>
              <p>Component customization coming soon...</p>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="tab-content">
              <h3>Advanced Customization</h3>
              <p>Advanced customization coming soon...</p>
            </div>
          )}
        </div>

        <div className="customizer-footer">
          <button className="reset-btn" onClick={resetToDefaults}>
            🔄 Reset to Defaults
          </button>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button 
              className="save-btn" 
              onClick={handleSave} 
              disabled={saving || !hasChanges}
            >
              {saving ? <LoadingSpinner size="small" /> : '💾 Save Changes'}
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

// Color Picker Component
const ColorPicker = ({ label, path, defaultValue, value, onChange }) => {
  const currentValue = value || defaultValue;
  
  return (
    <div className="customizer-item">
      <label>{label}</label>
      <div className="color-input-group">
        <input
          type="color"
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="color-picker"
        />
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultValue}
          className="color-text"
        />
      </div>
    </div>
  );
};

export default UICustomizer;

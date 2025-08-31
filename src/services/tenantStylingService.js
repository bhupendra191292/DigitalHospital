class TenantStylingService {
  constructor() {
    this.styleElementId = 'tenant-custom-css';
    this.initialized = false;
    this.defaultValues = {
      colors: {
        primary: '#2563eb',
        secondary: '#059669',
        accent: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        lineHeight: '1.5',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      }
    };
  }

  // Apply tenant styling globally with comprehensive coverage
  applyTenantStyling(tenant) {
    if (!tenant) {
      console.warn('No tenant provided to applyTenantStyling');
      return;
    }

    console.log('🎨 Applying tenant styling:', tenant.name);
    const root = document.documentElement;
    const ui = tenant.uiCustomization || {};

    // Apply colors with fallbacks
    this.applyColors(root, ui.colors);
    
    // Apply typography
    this.applyTypography(root, ui.typography);
    
    // Apply spacing
    this.applySpacing(root, ui.spacing);
    
    // Apply border radius
    this.applyBorderRadius(root, ui.borderRadius);
    
    // Apply shadows
    this.applyShadows(root, ui.shadows);
    
    // Apply component styles
    this.applyComponentStyles(ui.components);
    
    // Apply layout styles
    this.applyLayoutStyles(ui.layouts);
    
    // Apply custom CSS
    if (tenant.customCSS) {
      this.applyCustomCSS(tenant.customCSS);
    }

    // Force a repaint to ensure changes are visible
    this.forceRepaint();
  }

  // Apply colors with comprehensive coverage
  applyColors(root, colors) {
    if (!colors) return;

    const colorMap = {
      primary: 'primary-color',
      secondary: 'secondary-color',
      accent: 'accent-color',
      success: 'success-color',
      warning: 'warning-color',
      error: 'error-color',
      background: 'background-color',
      surface: 'surface-color',
      text: 'text-color',
      textSecondary: 'textSecondary-color'
    };

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = colorMap[key];
      if (cssVar && value) {
        root.style.setProperty(`--${cssVar}`, value);
        console.log(`🎨 Applied color: --${cssVar} = ${value}`);
      }
    });
  }

  // Apply typography settings
  applyTypography(root, typography) {
    if (!typography) return;

    if (typography.fontFamily) {
      root.style.setProperty('--font-family', typography.fontFamily);
    }

    if (typography.lineHeight) {
      root.style.setProperty('--line-height', typography.lineHeight);
    }

    if (typography.fontSize) {
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(`--font-size-${key}`, value);
        }
      });
    }
  }

  // Apply spacing values
  applySpacing(root, spacing) {
    if (!spacing) return;

    Object.entries(spacing).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--spacing-${key}`, value);
      }
    });
  }

  // Apply border radius values
  applyBorderRadius(root, borderRadius) {
    if (!borderRadius) return;

    Object.entries(borderRadius).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--border-radius-${key}`, value);
      }
    });
  }

  // Apply shadow values
  applyShadows(root, shadows) {
    if (!shadows) return;

    Object.entries(shadows).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--shadow-${key}`, value);
      }
    });
  }

  // Apply component-specific styles
  applyComponentStyles(components) {
    if (!components) return;

    const root = document.documentElement;

    // Button styles
    if (components.buttons) {
      const buttons = components.buttons;
      
      if (buttons.style) {
        root.style.setProperty('--button-style', buttons.style);
      }
      
      if (buttons.size) {
        root.style.setProperty('--button-size', buttons.size);
      }
      
      if (buttons.rounded !== undefined) {
        // Apply rounded class to all buttons
        this.updateButtonRoundedState(buttons.rounded);
      }
    }

    // Card styles
    if (components.cards) {
      const cards = components.cards;
      
      if (cards.style) {
        root.style.setProperty('--card-style', cards.style);
      }
      
      if (cards.padding) {
        root.style.setProperty('--card-padding', cards.padding);
      }
      
      if (cards.shadow) {
        root.style.setProperty('--card-shadow', cards.shadow);
      }
    }

    // Input styles
    if (components.inputs) {
      const inputs = components.inputs;
      
      if (inputs.style) {
        root.style.setProperty('--input-style', inputs.style);
      }
      
      if (inputs.size) {
        root.style.setProperty('--input-size', inputs.size);
      }
      
      if (inputs.focusStyle) {
        root.style.setProperty('--input-focus-style', inputs.focusStyle);
      }
    }
  }

  // Apply layout styles
  applyLayoutStyles(layouts) {
    if (!layouts) return;

    const root = document.documentElement;

    // Dashboard layout
    if (layouts.dashboard) {
      const dashboard = layouts.dashboard;
      
      if (dashboard.sidebar) {
        root.style.setProperty('--sidebar-position', dashboard.sidebar);
      }
      
      if (dashboard.header) {
        root.style.setProperty('--header-position', dashboard.header);
      }
      
      if (dashboard.grid) {
        root.style.setProperty('--dashboard-grid', dashboard.grid);
      }
    }

    // Form layout
    if (layouts.forms) {
      const forms = layouts.forms;
      
      if (forms.layout) {
        root.style.setProperty('--form-layout', forms.layout);
      }
      
      if (forms.labelPosition) {
        root.style.setProperty('--label-position', forms.labelPosition);
      }
    }
  }

  // Update button rounded state
  updateButtonRoundedState(rounded) {
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => {
      if (rounded) {
        btn.classList.add('rounded');
      } else {
        btn.classList.remove('rounded');
      }
    });
  }

  // Apply custom CSS
  applyCustomCSS(customCSS) {
    let styleElement = document.getElementById(this.styleElementId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = this.styleElementId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = customCSS;
  }

  // Reset all custom styling to defaults
  resetStyling() {
    console.log('🔄 Resetting all custom styling to defaults');
    const root = document.documentElement;
    
    // Remove all custom CSS variables
    const customProperties = [
      '--primary-color', '--secondary-color', '--accent-color', '--success-color',
      '--warning-color', '--error-color', '--background-color', '--surface-color',
      '--text-color', '--textSecondary-color', '--font-family', '--line-height',
      '--button-style', '--button-size', '--card-style', '--card-padding',
      '--card-shadow', '--input-style', '--input-size', '--input-focus-style',
      '--sidebar-position', '--header-position', '--dashboard-grid',
      '--form-layout', '--label-position'
    ];

    customProperties.forEach(prop => {
      root.style.removeProperty(prop);
    });

    // Remove spacing and border radius variables
    ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].forEach(size => {
      root.style.removeProperty(`--spacing-${size}`);
      root.style.removeProperty(`--border-radius-${size}`);
    });

    // Remove font size variables
    ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].forEach(size => {
      root.style.removeProperty(`--font-size-${size}`);
    });

    // Remove shadow variables
    ['sm', 'md', 'lg', 'xl'].forEach(size => {
      root.style.removeProperty(`--shadow-${size}`);
    });

    // Remove custom CSS
    const styleElement = document.getElementById(this.styleElementId);
    if (styleElement) {
      styleElement.remove();
    }

    // Reset button classes
    this.updateButtonRoundedState(false);

    // Force repaint
    this.forceRepaint();
  }

  // Force a repaint to ensure changes are visible
  forceRepaint() {
    // Trigger a repaint by accessing offsetHeight
    document.body.offsetHeight;
  }

  // Initialize styling from stored tenant data
  initializeFromStorage() {
    if (this.initialized) return;

    try {
      const tenantInfo = localStorage.getItem('tenantInfo');
      if (tenantInfo) {
        const tenant = JSON.parse(tenantInfo);
        this.applyTenantStyling(tenant);
        console.log('✅ Initialized tenant styling from storage');
      }
      this.initialized = true;
    } catch (error) {
      console.error('❌ Error initializing tenant styling from storage:', error);
    }
  }

  // Update tenant info in storage
  updateTenantInStorage(tenant) {
    try {
      localStorage.setItem('tenantInfo', JSON.stringify(tenant));
      console.log('💾 Updated tenant info in storage');
    } catch (error) {
      console.error('❌ Error updating tenant info in storage:', error);
    }
  }

  // Get current CSS variables for debugging
  getCurrentCSSVariables() {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const variables = {};
    
    // Get all CSS custom properties
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      if (property.startsWith('--')) {
        variables[property] = computedStyle.getPropertyValue(property);
      }
    }
    
    return variables;
  }
}

// Create singleton instance
const tenantStylingService = new TenantStylingService();

export default tenantStylingService;

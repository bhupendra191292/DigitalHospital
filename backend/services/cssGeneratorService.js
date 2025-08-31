class CSSGeneratorService {
  constructor() {
    this.cssTemplate = `
      /* Generated CSS for Tenant: {{tenantName}} */
      
      :root {
        /* Color Variables */
        --primary-color: {{primaryColor}};
        --secondary-color: {{secondaryColor}};
        --accent-color: {{accentColor}};
        --success-color: {{successColor}};
        --warning-color: {{warningColor}};
        --error-color: {{errorColor}};
        --background-color: {{backgroundColor}};
        --surface-color: {{surfaceColor}};
        --text-color: {{textColor}};
        --text-secondary-color: {{textSecondaryColor}};
        
        /* Typography Variables */
        --font-family: {{fontFamily}};
        --font-size-xs: {{fontSizeXs}};
        --font-size-sm: {{fontSizeSm}};
        --font-size-base: {{fontSizeBase}};
        --font-size-lg: {{fontSizeLg}};
        --font-size-xl: {{fontSizeXl}};
        --font-size-2xl: {{fontSize2xl}};
        --font-size-3xl: {{fontSize3xl}};
        --font-size-4xl: {{fontSize4xl}};
        --font-weight-light: {{fontWeightLight}};
        --font-weight-normal: {{fontWeightNormal}};
        --font-weight-medium: {{fontWeightMedium}};
        --font-weight-semibold: {{fontWeightSemibold}};
        --font-weight-bold: {{fontWeightBold}};
        --line-height: {{lineHeight}};
        
        /* Spacing Variables */
        --spacing-xs: {{spacingXs}};
        --spacing-sm: {{spacingSm}};
        --spacing-md: {{spacingMd}};
        --spacing-lg: {{spacingLg}};
        --spacing-xl: {{spacingXl}};
        --spacing-2xl: {{spacing2xl}};
        
        /* Border Radius Variables */
        --border-radius-sm: {{borderRadiusSm}};
        --border-radius-md: {{borderRadiusMd}};
        --border-radius-lg: {{borderRadiusLg}};
        --border-radius-xl: {{borderRadiusXl}};
        --border-radius-full: {{borderRadiusFull}};
        
        /* Shadow Variables */
        --shadow-sm: {{shadowSm}};
        --shadow-md: {{shadowMd}};
        --shadow-lg: {{shadowLg}};
        --shadow-xl: {{shadowXl}};
      }
      
      /* Global Styles */
      body {
        font-family: var(--font-family);
        color: var(--text-color);
        background-color: var(--background-color);
        line-height: var(--line-height);
      }
      
      /* Button Styles */
      .btn {
        border-radius: var(--border-radius-{{buttonBorderRadius}});
        font-size: var(--font-size-{{buttonFontSize}});
        font-weight: var(--font-weight-{{buttonFontWeight}});
        padding: var(--spacing-{{buttonPadding}});
        transition: all 0.3s ease;
      }
      
      .btn-primary {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
      }
      
      .btn-secondary {
        background-color: var(--secondary-color);
        border-color: var(--secondary-color);
        color: white;
      }
      
      .btn-accent {
        background-color: var(--accent-color);
        border-color: var(--accent-color);
        color: white;
      }
      
      /* Card Styles */
      .card {
        background-color: var(--surface-color);
        border-radius: var(--border-radius-{{cardBorderRadius}});
        padding: var(--spacing-{{cardPadding}});
        box-shadow: var(--shadow-{{cardShadow}});
        border: {{cardBorderStyle}};
      }
      
      /* Input Styles */
      .form-control {
        border-radius: var(--border-radius-{{inputBorderRadius}});
        font-size: var(--font-size-{{inputFontSize}});
        padding: var(--spacing-{{inputPadding}});
        border: 2px solid var(--surface-color);
        transition: all 0.3s ease;
      }
      
      .form-control:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px {{inputFocusStyle}};
      }
      
      /* Table Styles */
      .table {
        border-radius: var(--border-radius-{{tableBorderRadius}});
        overflow: hidden;
      }
      
      .table-striped tbody tr:nth-child(odd) {
        background-color: var(--surface-color);
      }
      
      .table-hover tbody tr:hover {
        background-color: {{tableHoverColor}};
      }
      
      /* Layout Adjustments */
      .dashboard-layout-{{dashboardLayout}} {
        display: grid;
        grid-template-areas: {{dashboardGridTemplate}};
        gap: var(--spacing-{{dashboardSpacing}});
      }
      
      .sidebar-{{sidebarPosition}} {
        grid-area: sidebar;
      }
      
      .header-{{headerPosition}} {
        grid-area: header;
      }
      
      .main-content {
        grid-area: main;
      }
      
      /* Form Layouts */
      .form-layout-{{formLayout}} {
        display: flex;
        flex-direction: {{formDirection}};
        gap: var(--spacing-{{formSpacing}});
      }
      
      .form-label-{{labelPosition}} {
        {{labelPositionStyle}};
      }
      
      /* Component Positioning */
      {{componentPositions}}
      
      /* Custom CSS Overrides */
      {{customCSS}}
    `;
  }

  generateCSS(tenant) {
    try {
      const ui = tenant.uiCustomization || {};
      
      // Extract values with defaults
      const values = {
        tenantName: tenant.name || 'Unknown',
        
        // Colors
        primaryColor: ui.colors?.primary || '#2563eb',
        secondaryColor: ui.colors?.secondary || '#059669',
        accentColor: ui.colors?.accent || '#f59e0b',
        successColor: ui.colors?.success || '#10b981',
        warningColor: ui.colors?.warning || '#f59e0b',
        errorColor: ui.colors?.error || '#ef4444',
        backgroundColor: ui.colors?.background || '#ffffff',
        surfaceColor: ui.colors?.surface || '#f8fafc',
        textColor: ui.colors?.text || '#1f2937',
        textSecondaryColor: ui.colors?.textSecondary || '#6b7280',
        
        // Typography
        fontFamily: ui.typography?.fontFamily || 'Inter, system-ui, sans-serif',
        fontSizeXs: ui.typography?.fontSize?.xs || '0.75rem',
        fontSizeSm: ui.typography?.fontSize?.sm || '0.875rem',
        fontSizeBase: ui.typography?.fontSize?.base || '1rem',
        fontSizeLg: ui.typography?.fontSize?.lg || '1.125rem',
        fontSizeXl: ui.typography?.fontSize?.xl || '1.25rem',
        fontSize2xl: ui.typography?.fontSize?.['2xl'] || '1.5rem',
        fontSize3xl: ui.typography?.fontSize?.['3xl'] || '1.875rem',
        fontSize4xl: ui.typography?.fontSize?.['4xl'] || '2.25rem',
        fontWeightLight: ui.typography?.fontWeight?.light || '300',
        fontWeightNormal: ui.typography?.fontWeight?.normal || '400',
        fontWeightMedium: ui.typography?.fontWeight?.medium || '500',
        fontWeightSemibold: ui.typography?.fontWeight?.semibold || '600',
        fontWeightBold: ui.typography?.fontWeight?.bold || '700',
        lineHeight: ui.typography?.lineHeight || '1.5',
        
        // Spacing
        spacingXs: ui.spacing?.xs || '0.25rem',
        spacingSm: ui.spacing?.sm || '0.5rem',
        spacingMd: ui.spacing?.md || '1rem',
        spacingLg: ui.spacing?.lg || '1.5rem',
        spacingXl: ui.spacing?.xl || '2rem',
        spacing2xl: ui.spacing?.['2xl'] || '3rem',
        
        // Border Radius
        borderRadiusSm: ui.borderRadius?.sm || '0.25rem',
        borderRadiusMd: ui.borderRadius?.md || '0.375rem',
        borderRadiusLg: ui.borderRadius?.lg || '0.5rem',
        borderRadiusXl: ui.borderRadius?.xl || '0.75rem',
        borderRadiusFull: ui.borderRadius?.full || '9999px',
        
        // Shadows
        shadowSm: ui.shadows?.sm || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        shadowMd: ui.shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        shadowLg: ui.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        shadowXl: ui.shadows?.xl || '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        
        // Component Styles
        buttonBorderRadius: ui.components?.buttons?.rounded ? 'lg' : 'md',
        buttonFontSize: ui.components?.buttons?.size || 'md',
        buttonFontWeight: ui.components?.buttons?.style === 'ghost' ? 'medium' : 'semibold',
        buttonPadding: ui.components?.buttons?.size === 'sm' ? 'sm' : ui.components?.buttons?.size === 'lg' ? 'lg' : 'md',
        
        cardBorderRadius: ui.components?.cards?.style === 'elevated' ? 'lg' : 'md',
        cardPadding: ui.components?.cards?.padding || 'lg',
        cardShadow: ui.components?.cards?.shadow || 'md',
        cardBorderStyle: ui.components?.cards?.style === 'outlined' ? '1px solid var(--surface-color)' : 'none',
        
        inputBorderRadius: ui.components?.inputs?.style === 'outlined' ? 'md' : 'lg',
        inputFontSize: ui.components?.inputs?.size || 'md',
        inputPadding: ui.components?.inputs?.size === 'sm' ? 'sm' : ui.components?.inputs?.size === 'lg' ? 'lg' : 'md',
        inputFocusStyle: ui.components?.inputs?.focusStyle === 'ring' ? 'rgba(37, 99, 235, 0.1)' : 'none',
        
        tableBorderRadius: ui.layouts?.tables?.borders ? 'md' : '0',
        tableHoverColor: ui.layouts?.tables?.hover ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
        
        // Layout
        dashboardLayout: ui.layouts?.dashboard?.grid || 'auto-fit',
        dashboardGridTemplate: this.generateGridTemplate(ui.layouts?.dashboard),
        dashboardSpacing: 'lg',
        
        sidebarPosition: ui.layouts?.dashboard?.sidebar || 'left',
        headerPosition: ui.layouts?.dashboard?.header || 'top',
        
        formLayout: ui.layouts?.forms?.layout || 'vertical',
        formDirection: ui.layouts?.forms?.layout === 'horizontal' ? 'row' : 'column',
        formSpacing: ui.layouts?.forms?.spacing || 'md',
        labelPosition: ui.layouts?.forms?.labelPosition || 'top',
        labelPositionStyle: this.generateLabelPositionStyle(ui.layouts?.forms?.labelPosition),
        
        // Component Positions
        componentPositions: this.generateComponentPositions(ui.layouts),
        
        // Custom CSS
        customCSS: tenant.customCSS || ''
      };
      
      // Replace placeholders in template
      let css = this.cssTemplate;
      Object.keys(values).forEach(key => {
        const placeholder = `{{${key}}}`;
        css = css.replace(new RegExp(placeholder, 'g'), values[key]);
      });
      
      return css;
    } catch (error) {
      console.error('Error generating CSS:', error);
      return this.generateDefaultCSS();
    }
  }

  generateGridTemplate(dashboardLayout) {
    if (!dashboardLayout) return '"header header" "sidebar main"';
    
    const { sidebar, header } = dashboardLayout;
    
    if (sidebar === 'left' && header === 'top') {
      return '"header header" "sidebar main"';
    } else if (sidebar === 'right' && header === 'top') {
      return '"header header" "main sidebar"';
    } else if (sidebar === 'top' && header === 'top') {
      return '"header" "sidebar" "main"';
    } else if (sidebar === 'bottom' && header === 'top') {
      return '"header" "main" "sidebar"';
    }
    
    return '"header header" "sidebar main"';
  }

  generateLabelPositionStyle(labelPosition) {
    switch (labelPosition) {
      case 'left':
        return 'text-align: right; padding-right: var(--spacing-md); min-width: 120px;';
      case 'inside':
        return 'position: absolute; top: 50%; left: var(--spacing-md); transform: translateY(-50%); color: var(--text-secondary-color);';
      default:
        return 'margin-bottom: var(--spacing-xs);';
    }
  }

  generateComponentPositions(layouts) {
    if (!layouts) return '';
    
    let css = '';
    
    // Dashboard component positioning
    if (layouts.dashboard?.cardLayout === 'masonry') {
      css += `
        .dashboard-grid {
          column-count: 3;
          column-gap: var(--spacing-lg);
        }
        .dashboard-card {
          break-inside: avoid;
          margin-bottom: var(--spacing-lg);
        }
      `;
    }
    
    // Form component positioning
    if (layouts.forms?.layout === 'inline') {
      css += `
        .form-inline {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        .form-inline .form-group {
          margin-bottom: 0;
        }
      `;
    }
    
    return css;
  }

  generateDefaultCSS() {
    return `
      :root {
        --primary-color: #2563eb;
        --secondary-color: #059669;
        --background-color: #ffffff;
        --text-color: #1f2937;
      }
      
      body {
        font-family: 'Inter, system-ui, sans-serif';
        color: var(--text-color);
        background-color: var(--background-color);
      }
    `;
  }
}

module.exports = new CSSGeneratorService();

const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const cssGeneratorService = require('../services/cssGeneratorService');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
const { resolveTenant, checkFeatureAccess, addTenantFilter } = require('../middlewares/tenantMiddleware');
const { validateTenant } = require('../middlewares/validationMiddleware');

// Public routes (no authentication required)
router.post('/register', tenantController.registerTenant);

// Tenant-specific routes (require tenant resolution)
router.get('/config', authMiddleware, resolveTenant, tenantController.getTenantConfig);
router.patch('/config', authMiddleware, resolveTenant, requireAdmin, tenantController.updateTenantConfig);
router.get('/stats', authMiddleware, resolveTenant, tenantController.getTenantStats);

// Get generated CSS for tenant
router.get('/css', resolveTenant, (req, res) => {
  try {
    const css = cssGeneratorService.generateCSS(req.tenant);
    res.set('Content-Type', 'text/css');
    res.send(css);
  } catch (error) {
    console.error('Error generating CSS:', error);
    res.status(500).send('/* Error generating CSS */');
  }
});

// Super admin routes (for managing all tenants)
router.get('/all', authMiddleware, requireAdmin, tenantController.listTenants);
router.patch('/:tenantId/status', authMiddleware, requireAdmin, tenantController.updateTenantStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const purchasereturnController = require('../controller/purchasereturncontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all purchase routes
router.use(isAuthenticatedUser);

// Create a new purchase return
router.post('/', purchasereturnController.createPurchaseReturn);

// Get all purchase returns for the logged-in user
router.get('/', purchasereturnController.getAllPurchaseReturns);

// Get purchase return by ID
router.get('/:id', purchasereturnController.getPurchaseReturnById);

// Get purchase returns by date range
router.get('/date-range', purchasereturnController.getPurchaseReturnsByDateRange);

// Update purchase return by ID
router.put('/:id', purchasereturnController.updatePurchaseReturn);

// Delete purchase return by ID
router.delete('/:id', purchasereturnController.deletePurchaseReturn);

module.exports = router;

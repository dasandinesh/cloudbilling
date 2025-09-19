const express = require('express');
const router = express.Router();
const purchaseController = require('../controller/purchasecontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all purchase routes
router.use(isAuthenticatedUser);

// Create a new purchase
router.post('/', purchaseController.createPurchase);

// Get all purchases for the logged-in user
router.get('/', purchaseController.getAllPurchases);

// Get purchase by ID
router.get('/:id', purchaseController.getPurchaseById);

// Get purchases by date range
router.get('/date-range', purchaseController.getPurchasesByDate);

// Update purchase by ID
router.put('/:id', purchaseController.updatePurchase);

// Delete purchase by ID
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;

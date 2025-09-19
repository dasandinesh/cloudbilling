const express = require('express');
const router = express.Router();
const purchaseorderController = require('../controller/purchaseordercontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all purchase routes
router.use(isAuthenticatedUser);

// Create a new purchase order
router.post('/', purchaseorderController.createPurchaseOrder);

// Get all purchase orders for the logged-in user
router.get('/', purchaseorderController.getAllPurchaseOrders);

// Get purchase order by ID
router.get('/:id', purchaseorderController.getSaleById);

// Get purchase orders by date range
router.get('/date-range', purchaseorderController.getPurchaseOrdersByDateRange);

// Update purchase order by ID
router.put('/:id', purchaseorderController.updatePurchaseOrder);

// Delete purchase order by ID
router.delete('/:id', purchaseorderController.deletePurchaseOrder);

module.exports = router;

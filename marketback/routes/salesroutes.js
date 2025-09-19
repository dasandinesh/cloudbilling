const express = require('express');
const router = express.Router();
const salesController = require('../controller/salescontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all sales routes
router.use(isAuthenticatedUser);

// Sales routes
router.post('/create', salesController.createSale);
router.get('/all', salesController.getAllSales);
router.get('/get', salesController.getSaleById); // expects ?arg1=<id>
router.get('/by-customer', salesController.getSalesByCustomerId); // expects ?customerId=<customerId>
router.put('/update', salesController.updateSale); // expects { arg1, formData }
router.delete('/delete/:id', salesController.deleteSale); // expects ?arg=<id>

module.exports = router;
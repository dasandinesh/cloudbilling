const express = require('express');
const router = express.Router();
const salesreturnController = require('../controller/salesreturncontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all sales routes
router.use(isAuthenticatedUser);

// Sales return routes
router.post('/create', salesreturnController.createSalesReturn);
router.get('/all', salesreturnController.getAllSalesReturns);
router.get('/get', salesreturnController.getSalesReturnById); // expects ?arg1=<id>
router.get('/by-customer', salesreturnController.getSalesReturnsByCustomerId); // expects ?customerId=<customerId>
router.put('/update', salesreturnController.updateSalesReturn); // expects { arg1, formData }
router.delete('/delete/:id', salesreturnController.deleteSalesReturn); // expects ?arg=<id>

module.exports = router;
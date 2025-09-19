const express = require('express');
const router = express.Router();
const salesorderController = require('../controller/salesordercontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all sales routes
router.use(isAuthenticatedUser);

// Sales order routes
router.post('/create', salesorderController.createSalesOrder);
router.get('/all', salesorderController.getAllSalesOrders);
router.get('/get', salesorderController.getSalesOrderById); // expects ?arg1=<id>
router.get('/by-customer', salesorderController.getSalesOrdersByCustomerId); // expects ?customerId=<customerId>
router.put('/update', salesorderController.updateSalesOrder); // expects { arg1, formData }
router.delete('/delete/:id', salesorderController.deleteSalesOrder); // expects ?arg=<id>

module.exports = router;
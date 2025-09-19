const express = require('express');
const router = express.Router();
const EstimatesOrderController = require('../controller/estimateordercontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all sales routes
router.use(isAuthenticatedUser);

// Sales routes
router.post('/create', EstimatesOrderController.createEstimateOrder);
router.get('/all', EstimatesOrderController.getAllEstimateOrders);
router.get('/get', EstimatesOrderController.getEstimateOrderById); // expects ?arg1=<id>
router.get('/by-customer', EstimatesOrderController.getEstimateOrdersByCustomerId); // expects ?customerId=<customerId>
router.put('/update', EstimatesOrderController.updateEstimateOrder); // expects { arg1, formData }
router.delete('/delete/:id', EstimatesOrderController.deleteEstimateOrder); // expects ?arg=<id>

module.exports = router;
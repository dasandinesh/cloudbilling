const express = require('express');
const router = express.Router();
const estimateController = require('../controller/estimatecontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all sales routes
router.use(isAuthenticatedUser);

// Sales routes
router.post('/create', estimateController.createEstimate);
router.get('/all', estimateController.getAllEstimates);
router.get('/get', estimateController.getEstimateById); // expects ?arg1=<id>
router.get('/by-customer', estimateController.getEstimateByCustomerId); // expects ?customerId=<customerId>
router.put('/update', estimateController.updateEstimate); // expects { arg1, formData }
router.delete('/delete/:id', estimateController.deleteEstimate); // expects ?arg=<id>

module.exports = router;
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require('../controller/odercontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');

// Apply authentication middleware to all customer routes
router.use(isAuthenticatedUser);

// Routes
router.post('/', createOrder);           // Create
router.get('/', getAllOrders);           // Read all
router.get('/single', getOrderById);     // Read one
router.post('/updateorder', updateOrder); // Update
router.delete('/:id', deleteOrder);      // Delete

module.exports = router;

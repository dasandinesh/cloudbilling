const express = require('express');
const router = express.Router();
const productController = require('../controller/productcontroller');
const { isAuthenticatedUser } = require('../middleware/authenticate');
const { authorizeRoles } = require('../middleware/authenticate');

// Create a new product
router.post('/', isAuthenticatedUser, productController.createProduct);

// Get all products
router.get('/', isAuthenticatedUser, productController.getProducts);

// Get a product by ID
router.get('/:id', isAuthenticatedUser, productController.getProductById);

// Update a product by ID
router.put('/:id', isAuthenticatedUser, productController.updateProduct);

// Delete a product by ID
router.delete('/:id', isAuthenticatedUser, productController.deleteProduct);

module.exports = router;
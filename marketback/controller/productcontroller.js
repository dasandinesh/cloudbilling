const ProductModel = require('../model/productmodule');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const Product = ProductModel;
    // Add the current user's ID to the product
    const productData = {
      ...req.body,
      userId: req.user._id // Add the authenticated user's ID
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products for the logged-in user
exports.getProducts = async (req, res) => {
  try {
    const Product = ProductModel;
    // Only find products belonging to the authenticated user
    const products = await Product.find({ userId: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a product by ID (only if it belongs to the user)
exports.getProductById = async (req, res) => {
  try {
    const Product = ProductModel;
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product by ID (only if it belongs to the user)
exports.updateProduct = async (req, res) => {
  try {
    const Product = ProductModel;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found or access denied' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product by ID (only if it belongs to the user)
exports.deleteProduct = async (req, res) => {
  try {
    const Product = ProductModel;
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or access denied' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

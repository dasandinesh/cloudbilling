const Customer = require('../model/customermodule');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    // Add the current user's ID to the customer
    const customerData = {
      ...req.body,
      userId: req.user._id // Add the authenticated user's ID
    };
    const customer = new Customer(customerData);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all customers for the logged-in user
exports.getCustomers = async (req, res) => {
  try {
    // Only find customers belonging to the authenticated user
    const customers = await Customer.find({ userId: req.user._id });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a customer by ID (only if it belongs to the user)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ 
      _id: req.params.id,
      userId: req.user._id // Ensure the customer belongs to the user
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or access denied' });
    }
    
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a customer by ID (only if it belongs to the user)
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { 
        _id: req.params.id,
        userId: req.user._id // Ensure the customer belongs to the user
      },
      req.body,
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or access denied' });
    }
    
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customer by ID (only if it belongs to the user)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id // Ensure the customer belongs to the user
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or access denied' });
    }
    
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const mongoose = require('mongoose');
const OrderModel = require('../model/ordermodule');
const CustomerModel = require('../model/customermodule');

 
// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const Order = OrderModel;
        const Customer = CustomerModel;
        
        // Add the current user's ID to the order
        const orderData = {
            ...req.body,
            userId: req.user._id // Add the authenticated user's ID
        };
        
        const order = new Order(orderData);
        const { new_balance } = req.body.bill_details;
        console.log("new_balance", new_balance);
        
        // Find customer by name and user ID to ensure data isolation
        const customer = await Customer.findOne({ 
            name: order.customer.name,
            userId: req.user._id 
        });
        
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        
        customer.oldBalance = new_balance;
        await customer.save();
        await order.save();
        res.status(201).json({ success: true, message: 'Order created', order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all orders for the logged-in user
exports.getAllOrders = async (req, res) => {
    try {
        const Order = OrderModel;
        const { date } = req.query;
        
        // Start with user-based filtering
        let query = { userId: req.user._id };

        // Add date filter if provided
        if (date) {
            query['bill_details.date'] = date;
            query['bill_details.order_status'] = 'open';
        }
    
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get order by ID (only if it belongs to the user)
exports.getOrderById = async (req, res) => {
    try {
        const Order = OrderModel;
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }
  
        // Find order by ID and user ID to ensure data isolation
        const order = await Order.findOne({ _id: id, userId: req.user._id });
        
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or you do not have permission to view this order' 
            });
        }
  
        res.status(200).json({ success: true, order }); // frontend-க்கு order data அனுப்புகிறது
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Update order by ID (only if it belongs to the user)
exports.updateOrder = async (req, res) => {
    try {
        const Order = OrderModel;
        const Customer = CustomerModel;
        const { arg1: id, formData } = req.body;
  
        if (!id) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }
  
        // Find the existing order and verify it belongs to the user
        const existingOrder = await Order.findOne({ _id: id, userId: req.user._id });
        if (!existingOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or you do not have permission to update this order' 
            });
        }
  
        // Update the order with new data
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            formData,
            { new: true }
        );
  
        // If customer balance is being updated
        if (formData.bill_details?.new_balance !== undefined) {
            const customer = await Customer.findOne({ 
                name: updatedOrder.customer.name,
                userId: req.user._id 
            });
            if (customer) {
                customer.oldBalance = formData.bill_details.new_balance;
                await customer.save();
            }
        }
  
        res.status(200).json({ success: true, order: updatedOrder }); // frontend-க்கு order data அனுப்புகிறது
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Delete order by ID (only if it belongs to the user)
exports.deleteOrder = async (req, res) => {
    try {
        const Order = OrderModel;
        const id = req.params.id;
  
        if (!id) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }
  
        // Find and delete the order, ensuring it belongs to the user
        const deletedOrder = await Order.findOneAndDelete({ 
            _id: id, 
            userId: req.user._id 
        });
  
        if (!deletedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or you do not have permission to delete this order' 
            });
        }
  
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('🔴 Delete error:', error); 
        res.status(500).json({ message: 'Server error' });
    }
};



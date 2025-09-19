const Purchase = require('../model/purchasemodule');

// Create a new purchase
const createPurchase = async (req, res) => {
    try {
        const { customer, products, bill_details = {} } = req.body;
        
        // Calculate total amount from products
        const total_amount = products.reduce((sum, product) => {
            return sum + (Number(product.quantity) * Number(product.single_price) || 0);
        }, 0);

        // Generate a bill number if not provided
        const bill_no = bill_details.bill_no || `PUR-${Date.now()}`;
        
        // Prepare purchase data with calculated fields
        const purchaseData = {
            customer,
            products: products.map(product => ({
                ...product,
                quantity: Number(product.quantity) || 0,
                single_price: Number(product.single_price) || 0,
                price: (Number(product.quantity) * Number(product.single_price)) || 0
            })),
            bill_details: {
                ...bill_details,
                bill_no,
                total_amount,
                grand_total: total_amount - (Number(bill_details.discount) || 0) + (Number(bill_details.tax_amount) || 0),
                payment_status: bill_details.payment_status || 'pending',
                date: bill_details.date || new Date()
            },
            userId: req.user._id
        };

        const purchase = new Purchase(purchaseData);
        await purchase.save();
        
        res.status(201).json({ success: true, purchase });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all purchases for the logged-in user
const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.user._id })
            .sort({ 'bill_details.date': -1 });
        
        res.status(200).json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get purchase by ID (only if it belongs to the user)
const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Purchase ID is required' });
        }

        const purchase = await Purchase.findOne({ 
            _id: id, 
            userId: req.user._id 
        });

        if (!purchase) {
            return res.status(404).json({ 
                success: false, 
                message: 'Purchase not found or you do not have permission to view this purchase' 
            });
        }

        res.status(200).json({ success: true, purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get purchases by date range (only for the logged-in user)
const getPurchasesByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate) {
            return res.status(400).json({ success: false, message: 'Start date is required' });
        }

        let query = { userId: req.user._id };
        
        // If both start and end dates are provided
        if (startDate && endDate) {
            query['bill_details.date'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else {
            // If only start date is provided, get purchases for that specific date
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(startDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            query['bill_details.date'] = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        }

        const purchases = await Purchase.find(query)
            .sort({ 'bill_details.date': -1 });
        
        res.status(200).json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update purchase by ID (only if it belongs to the user)
const updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedPurchase = await Purchase.findOneAndUpdate(
            { 
                _id: id, 
                userId: req.user._id 
            },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPurchase) {
            return res.status(404).json({ 
                success: false, 
                message: 'Purchase not found or you do not have permission to update this purchase' 
            });
        }

        res.status(200).json({ success: true, purchase: updatedPurchase });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete purchase by ID (only if it belongs to the user)
const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedPurchase = await Purchase.findOneAndDelete({
            _id: id,
            userId: req.user._id
        });

        if (!deletedPurchase) {
            return res.status(404).json({ 
                success: false, 
                message: 'Purchase not found or you do not have permission to delete this purchase' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Purchase deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    getPurchasesByDate,
    updatePurchase,
    deletePurchase
};

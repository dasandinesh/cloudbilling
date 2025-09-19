const mongoose = require('mongoose');
const EstimatesModel = require('../model/estimatemodule');
const EstimatesOrderModel = require('../model/estimatesordermodule');
// Create a new sale
exports.createEstimate = async (req, res) => {
  try {
    const Estimates = EstimatesModel;
    const EstimatesOrder = EstimatesOrderModel;
    
    // Add the current user's ID to the sale
    const saleData = {
      ...req.body,
      userId: req.user._id // Add the authenticated user's ID
    };
    
    // If there's a customer ID, add it to the customer object
    if (req.body.customerId) {
      saleData.customer = {
        ...saleData.customer,
        customerId: req.body.customerId
      };
    }
    
    const sale = new Estimates(saleData);
    await sale.save();
    
    if (req.body.bill_details && req.body.bill_details.order_status === 'open') {
      const order_sno = req.body.bill_details.order_sno;
      
      await EstimatesOrder.findOneAndUpdate(
        { 
          'bill_details.order_sno': order_sno,
          userId: req.user._id // Ensure the order belongs to the user
        },
        { $set: { 'bill_details.order_status': 'close' } }
      );
    }
    
    res.status(201).json({ success: true, message: 'Estimate உருவாக்கப்பட்டது', sale });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all estimates for the logged-in user with optional date filtering
exports.getAllEstimates = async (req, res) => {
  try {
    const Estimates = EstimatesModel;
    const { date } = req.query;
    
    // Build the query object
    const query = { userId: req.user._id };
    
    // Add date filter if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    
    // Find estimates matching the query
    const estimates = await Estimates.find(query).sort({ createdAt: -1 });
    
    res.status(200).json(estimates);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single sale by ID (query method) - only if it belongs to the user
exports.getEstimateById = async (req, res) => {
  try {
    const id = req.query.arg1;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'தவறான அல்லது காணாத Sale ID' });
    }

    const Estimates = EstimatesModel;
    const sale = await Estimates.findOne({
      _id: id,
      userId: req.user._id // Ensure the sale belongs to the user
    });

    if (!sale) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sale கிடைக்கவில்லை அல்லது அணுக முடியவில்லை' 
      });
    }

    res.status(200).json({ success: true, sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sales by customer ID (only for the logged-in user)
exports.getEstimateByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'தவறான அல்லது காணாத வாடிக்கையாளர் ID' 
      });
    }

    const Estimates = EstimatesModel;
    // Only find sales for this customer that belong to the authenticated user
    const sales = await Estimates.find({ 
      'bill_details.customer_id': customerId,
      userId: req.user._id // Ensure the sales belong to the user
    }).sort({ 'bill_details.bill_date': -1 });

    if (!sales || sales.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'இந்த வாடிக்கையாளருக்கான பில் விவரங்கள் எதுவும் இல்லை' 
      });
    }

    // Calculate balance for each sale
    const salesWithBalance = sales.map(sale => ({
      ...sale.toObject(),
      balance: calculateBalance(sale)
    }));

    res.status(200).json({ 
      success: true, 
      sales: salesWithBalance 
    });
  } catch (error) {
    console.error('Error fetching sales by customer ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'பில் விவரங்களைப் பெறுவதில் பிழை',
      error: error.message 
    });
  }
};

// Helper function to calculate balance for a sale
function calculateBalance(sale) {
  if (!sale || !sale.bill_details) return 0;
  
  const totalAmount = sale.bill_details.total_amount || 0;
  const paidAmount = sale.payments?.reduce((sum, payment) => {
    return sum + (payment.amount || 0);
  }, 0) || 0;
  
  return totalAmount - paidAmount;
}

// Update estimate by ID (only if it belongs to the user)
exports.updateEstimate = async (req, res) => {
  try {
    const { arg1, formData } = req.body;

    if (!arg1 || !mongoose.Types.ObjectId.isValid(arg1)) {
      return res.status(400).json({ success: false, message: 'தவறான அல்லது காணாத Sale ID' });
    }

    const Sales = SalesModel;
    const updatedSale = await Sales.findOneAndUpdate(
      { 
        _id: arg1,
        userId: req.user._id // Ensure the sale belongs to the user
      },
      {
        $set: {
          customer: formData.customer,
          products: formData.products,
          bill_details: formData.bill_details,
        },
      },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sale கிடைக்கவில்லை அல்லது அணுக உங்களுக்கு அனுமதி இல்லை' 
      });
    }

    res.status(200).json({ success: true, message: 'Sale வெற்றிகரமாக புதுப்பிக்கப்பட்டது', data: updatedSale });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete estimate by ID (only if it belongs to the user)
exports.deleteEstimate = async (req, res) => {
  try {
    const saleId = req.params.id;

    if (!saleId || !mongoose.Types.ObjectId.isValid(saleId)) {
      return res.status(400).json({ success: false, message: 'தவறான அல்லது காணாத Sale ID' });
    }

    const Sales = SalesModel;
    const deletedSale = await Sales.findOneAndDelete({ 
      _id: saleId,
      userId: req.user._id // Ensure the sale belongs to the user
    });

    if (!deletedSale) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sale கிடைக்கவில்லை அல்லது நீக்க உங்களுக்கு அனுமதி இல்லை' 
      });
    }

    res.status(200).json({ success: true, message: 'Sale வெற்றிகரமாக நீக்கப்பட்டது' });

  } catch (error) {
    console.error("🔴 Delete error:", error);
    res.status(500).json({ success: false, message: 'Server பிழை — delete செய்ய முடியவில்லை' });
  }
};

const mongoose = require('mongoose');

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  product_serial_no: String,
  product_description: String,
  product_hsn: String,
  quantity: { type: Number, required: true },
  single_price: { type: Number, required: true },
  tgstpre: Number,
  crossprice: Number,
  crossprice_total: Number,
  scale: String,
  scaleno: String,
  Cgst: Number,
  sgst: Number,
  bagprice: Number,
  Wages: Number,
  commission: Number,
  price: { type: Number, required: true },
});

// Bill details schema
const purchaseorderbillDetailsSchema = new mongoose.Schema({
  bill_no: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  bill_date: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  total_amount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  grand_total: { type: Number, required: true },
  payment_status: { type: String, default: 'pending' },
  payment_mode: String,
  notes: String,
});

// Customer schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
  gstin: String,
  state: String,
  state_code: String,
});

// Main purchase order schema
const purchaseorderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  customer: customerSchema,
  products: [productSchema],
  bill_details: purchaseorderbillDetailsSchema,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Middleware to auto-update updated_at
purchaseorderSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Purchaseorder = mongoose.model('Purchaseorder', purchaseorderSchema);

module.exports = Purchaseorder;

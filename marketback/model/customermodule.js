const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
  phone: { type: String },
  door: { type: String },
  street: { type: String },
  area: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: String },
  oldBalance: { type: Number, default: 0 }
}, { timestamps: true });

// Default global model (legacy)
const CustomerModel = mongoose.model('Customer', customerSchema);
// Expose schema for tenant-aware binding
CustomerModel.customerSchema = customerSchema;

module.exports = CustomerModel;

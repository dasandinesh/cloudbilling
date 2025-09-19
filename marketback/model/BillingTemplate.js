const mongoose = require('mongoose');

const billingHeaderSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String, // URL or path to the logo
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    branch: String,
    ifscCode: String
  },
  termsAndConditions: [String],
  footerNote: String,
  isActive: {
    type: Boolean,
    default: true
  },
  // Reference to the company this template belongs to
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  // Reference to the user who created this template
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // For multi-tenant architecture
  tenantId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
billingHeaderSchema.index({ companyId: 1, isActive: 1 });
billingHeaderSchema.index({ tenantId: 1 });

const BillingTemplate = mongoose.model('BillingTemplate', billingHeaderSchema);

module.exports = BillingTemplate;

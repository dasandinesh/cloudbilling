const mongoose = require('mongoose');

// Address Schema for branches
const addressSchema = new mongoose.Schema({
  doorno: {
    type: String,
    required: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  places: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
  }
}, { _id: false });

// Branch Schema
const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: {
    type: addressSchema,
    required: true
  },
  estimatefiledoptionsId: {
    type: String,
    trim: true
  }
}, { _id: true });

// Company Schema
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  branches: [branchSchema]
}, {
  timestamps: true
});

// Create indexes for better performance
companySchema.index({ name: 1 });
companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ 'branches.code': 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

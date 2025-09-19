const mongoose = require('mongoose');
const Counter = require('./counter');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String },
    quantity: { type: String, required: true },
    single_price: { type: String, required: true },
    scale: { type: String },
    scaleno: { type: String },
    single_bag_amount: { type: String },
    bagprice: { type: String },
    single_wages_amount: { type: String },
    Wages: { type: String },
    single_commission_amount: { type: String },
    commission: { type: String },
    price: { type: String }
}, { _id: false });

const billDetailsSchema = new mongoose.Schema({
    order_sno:{type:Number},
    date: { type: String, required: true },
    bill_date: { type: String, required: true },
    total_quantity: { type: String },
    transport: { type: String },
    totalbagprice: { type: String },
    totalWages: { type: String },
    totalcommission: { type: String },
    credit: { type: String },
    cash: { type: String },
    old_balance: { type: String },
    new_balance: { type: String },
    bill_amount: { type: String, required: true },
    order_status: {type: String,default: 'open'}

    
}, { _id: false,autoIndex: true });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customer: {
        name: { type: String, required: true },
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
    },
    products: [productSchema],
    bill_details: billDetailsSchema,
}, { timestamps: true,autoIndex: true });

// Ensure order_sno is unique across orders
orderSchema.index(
  { 'bill_details.order_sno': 1 },
  { unique: true, partialFilterExpression: { 'bill_details.order_sno': { $exists: true } } }
);

// Auto-increment and assign order_sno before saving a new order
orderSchema.pre('save', async function(next) {
  try {
    if (!this.bill_details) {
      this.bill_details = {};
    }
    if (this.isNew && (this.bill_details.order_sno === undefined || this.bill_details.order_sno === null)) {
      const counter = await Counter.findOneAndUpdate(
        { _id: 'order_sno' },
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
      );
      this.bill_details.order_sno = counter.seq;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Default export remains the global connection-bound model (backward compatible)
const OrderModel = mongoose.model('order', orderSchema);
// Also expose the schema so tenant-aware controllers can bind it to req.tenantConn
OrderModel.orderSchema = orderSchema;

module.exports = OrderModel;

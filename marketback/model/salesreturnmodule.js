const mongoose = require('mongoose');

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
    bill_number: { type: String, unique: true },
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
    bill_amount: { type: String, required: true }
}, { _id: false });

const salesreturnSchema = new mongoose.Schema({
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
    bill_details: billDetailsSchema
}, { timestamps: true });

// Auto-increment bill number
salesreturnSchema.pre('save', async function(next) {
    if (this.isNew && !this.bill_details.bill_number) {
        try {
            const lastSale = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
            let billNumber = 1;
            
            if (lastSale && lastSale.bill_details.bill_number) {
                const lastBillNum = parseInt(lastSale.bill_details.bill_number.replace('SB-', ''));
                billNumber = lastBillNum + 1;
            }
            
            this.bill_details.bill_number = `SB-${billNumber.toString().padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Default export remains the global connection-bound model (backward compatible)
const SalesreturnModel = mongoose.model('salesreturn', salesreturnSchema);
// Also expose the schema so tenant-aware controllers can bind it to req.tenantConn
SalesreturnModel.salesreturnSchema = salesreturnSchema;

module.exports = SalesreturnModel;

const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');
const orderRoutes = require('./routes/orderroutes'); 
const salesRoutes = require('./routes/salesroutes'); 
const productRoutes = require('./routes/productroutes'); 
const receiptRoutes = require('./routes/recepetroutes'); 
const customerRoutes = require('./routes/customerroutes');
const companyRoutes = require('./routes/companyRoutes');
const AuthRouter = require('./routes/AuthRouter');
const purchaseRoutes = require('./routes/purchaseroutes');
const purchaseorderRoutes = require('./routes/purchaseorderroutes');
const purchasereturnRoutes = require('./routes/purchasereturnroutes');
const salesorderRoutes = require('./routes/salesorderroutes');
const salesreturnRoutes = require('./routes/salesreturnroutes');
const estimateRoutes = require('./routes/estimate');
const estimateorderRoutes = require('./routes/estimateorder');

const cookieParser = require('cookie-parser');
const app = express();

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

// Connect to Database
connectDatabase();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true, // ✅ Allows cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/products', productRoutes);
 app.use('/api/receipts', receiptRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/auth', AuthRouter);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/purchasereturns', purchasereturnRoutes);
app.use('/api/purchaseorder', purchaseorderRoutes);
app.use('/api/salesorder', salesorderRoutes);
app.use('/api/salesreturns', salesreturnRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/estimates', estimateRoutes);
app.use('/api/estimateorder', estimateorderRoutes);
module.exports = app;

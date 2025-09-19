import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Authentication
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Components
import Navbar from "./components/navbar/navpar";
import Home from "./components/home";
import Customer from "./components/customer/customer";
import Orderform from "./components/order/orderform";
import Product from "./components/product/product";
import AddProduct from "./components/product/addproduct";
import OrderPrintPre from "./components/order/orderPrintPre";
import SaleEntry from "./components/sale/saleentry";
import Ledger from "./components/accounts/ledger";
import ReceiptEntry from "./components/accounts/recept_entry";
import ReceipList from "./components/accounts/receipt";
import ExpenseList from "./components/accounts/ExpenseList";
import PurchaseEntry from "./components/purchase/purchaseentry";
import Purchasemenu from "./components/setting/Purchasemenu";
import SaleGstEntry from "./components/salegst/Salegstentry";
import LastBill from "./components/sale/LastBill";
import BranchList from "./components/company/BranchList";
import CompanyList from "./components/company/CompanyList";
import UserList from "./components/user/UserList";
import Test from "./components/accounts/test";
import Test2 from "./components/accounts/test2";
import MobileOrderEntry from "./components/order/mobilorderentry";
import MobileSaleEntry from "./components/sale/mobilsaleentry";
import BillList from './components/sale/billlist';
import CustomerHome from './components/customer/customerhome';
import EstimateEntry from './components/estimate/estimateentry';

function App() {
  // State to hold the selected order
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Function to set selected order
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/order" element={
              <ProtectedRoute>
                <Orderform onSelectOrder={handleSelectOrder} />
              </ProtectedRoute>
            } />
            <Route path="/saleentry" element={
              <ProtectedRoute>
                <SaleEntry />
              </ProtectedRoute>
            } />
            <Route path="/product" element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            } />
            <Route path="/addproduct" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/customer" element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            } />
            <Route path="/Ledger" element={
              <ProtectedRoute>
                <Ledger />
              </ProtectedRoute>
            } />
            <Route path="/receiptentry" element={
              <ProtectedRoute>
                <ReceiptEntry />
              </ProtectedRoute>
            } />
            <Route path="/receipt" element={
              <ProtectedRoute>
                <ReceipList />
              </ProtectedRoute>
            } />
            <Route path="/ExpenseList" element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            } />
            <Route path="/PurchaseEntry" element={
              <ProtectedRoute>
                <PurchaseEntry />
              </ProtectedRoute>
            } />
            <Route path="/Purchasemenu" element={
              <ProtectedRoute>
                <Purchasemenu />
              </ProtectedRoute>
            } />
            <Route path="/SaleGstEntry" element={
              <ProtectedRoute>
                <SaleGstEntry />
              </ProtectedRoute>
            } />
            <Route path="/LastBill" element={
              <ProtectedRoute>
                <LastBill />
              </ProtectedRoute>
            } />
            <Route path="/company" element={
              <ProtectedRoute>
                <CompanyList />
              </ProtectedRoute>
            } />
            <Route path="/branch" element={
              <ProtectedRoute>
                <BranchList />
              </ProtectedRoute>
            } />
            <Route path="/userlist" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/test" element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            } />
            <Route path="/test2" element={
              <ProtectedRoute>
                <Test2 />
              </ProtectedRoute>
            } />
            <Route path="/mobilorder" element={
              <ProtectedRoute>
                <MobileOrderEntry />
              </ProtectedRoute>
            } />
            <Route path="/mobilSale" element={
              <ProtectedRoute>
                <MobileSaleEntry />
              </ProtectedRoute>
            } />
            <Route path="/billlist" element={
              <ProtectedRoute>
                <BillList />
              </ProtectedRoute>
            } />
            <Route path="/customerhome" element={
              <ProtectedRoute>
                <CustomerHome />
              </ProtectedRoute>
            } />
            <Route path="/orderprint" element={
              <ProtectedRoute>
                <OrderPrintPre selectedOrder={selectedOrder} />
              </ProtectedRoute>
            } />
            <Route path="/estimateentry" element={
              <ProtectedRoute>
                <EstimateEntry />
              </ProtectedRoute>
            } />
          </Routes>
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;

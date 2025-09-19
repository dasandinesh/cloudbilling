import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import axios from 'axios';
import { URL_get_receipt, URL_getallcustomer } from './url/url';

const Home = () => {
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [receipts, setReceipts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [receiptRes, customerRes] = await Promise.all([
          axios.get(URL_get_receipt),
          axios.get(URL_getallcustomer),
        ]);

        const recs = Array.isArray(receiptRes.data) ? receiptRes.data : [];
        const custs = Array.isArray(customerRes.data) ? customerRes.data : [];

        setReceipts(recs);
        setCustomers(custs);
      } catch (err) {
        console.error('Error loading dashboard data', err);
        setError('Failed to load summary.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Recalculate metrics when data or filters change
  useEffect(() => {
    // Customers count and pending
    setCustomerCount(customers.length);
    const totalPending = customers.reduce((sum, c) => sum + (Number(c.oldBalance) || 0), 0);
    setPendingTotal(totalPending);

    // Receipt total with optional date filter
    const inRange = (dateStr) => {
      if (!dateStr) return true;
      const d = new Date(dateStr);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;
      return true;
    };
    const totalReceipt = receipts
      .filter(r => inRange(r.date))
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    setReceiptTotal(totalReceipt);
  }, [customers, receipts, fromDate, toDate]);

  const menuItems = [
    { path: "/order", label: "Order Management", icon: "📋", description: "Create and manage orders" },
    { path: "/saleentry", label: "Sale Entry", icon: "💰", description: "Record sales transactions" },
    { path: "/product", label: "Products", icon: "📦", description: "View product catalog" },
    { path: "/addproduct", label: "Add Product", icon: "➕", description: "Add new products" },
    { path: "/customer", label: "Customers", icon: "👥", description: "Manage customer database" },
    { path: "/Ledger", label: "Ledger", icon: "📊", description: "Financial ledger management" },
    { path: "/receiptentry", label: "Receipt Entry", icon: "🧾", description: "Create new receipts" },
    { path: "/receipt", label: "Receipts", icon: "📄", description: "View all receipts" },
    { path: "/ExpenseList", label: "Expenses", icon: "💸", description: "Track expenses" },
    { path: "/PurchaseEntry", label: "Purchase Entry", icon: "🛒", description: "Record purchases" },
    { path: "/Purchasemenu", label: "Purchase Menu", icon: "⚙️", description: "Purchase settings" },
    { path: "/SaleGstEntry", label: "Sale GST Entry", icon: "🏛️", description: "GST sales management" },
    { path: "/LastBill", label: "Last Bill", icon: "📋", description: "Recent bill information" },
    { path: "/company", label: "Companies", icon: "🏢", description: "Company management" },
    { path: "/branch", label: "Branches", icon: "🏪", description: "Branch management" },
    { path: "/userlist", label: "Users", icon: "👤", description: "User management" },
    { path: "/mobilorder", label: "Mobile Order", icon: "📱", description: "Mobile order entry" },
    { path: "/mobilSale", label: "Mobile Sale", icon: "📱💰", description: "Mobile sale entry" },
    { path: "/test", label: "Test", icon: "🧪", description: "Testing component" },
    { path: "/test2", label: "Test 2", icon: "🧪", description: "Another test component" }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h6>Welcome to Market Management System</h6>
      </div>
      
      {/* Filters for receipt total */}
      <div className="summary-filters">
        <div className="filter-field">
          <label>From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-field">
          <label>To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button className="btn-clear" onClick={() => { setFromDate(''); setToDate(''); }}>Clear</button>
      </div>

      {/* Summary Section */}
      <div className="summary-grid">
        <Link to="/receipt" className="summary-card link">
          <div className="summary-title">Receipt Amount</div>
          <div className="summary-value">
            {loading ? 'Loading…' : error ? '-' : receiptTotal.toLocaleString()}
          </div>
        </Link>
        <Link to="/customer" className="summary-card link">
          <div className="summary-title">Customers</div>
          <div className="summary-value">
            {loading ? 'Loading…' : error ? '-' : customerCount}
          </div>
        </Link>
        <Link to="/Ledger" className="summary-card link">
          <div className="summary-title">Pending Amount</div>
          <div className="summary-value">
            {loading ? 'Loading…' : error ? '-' : pendingTotal.toLocaleString()}
          </div>
        </Link>
      </div>
      
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index} className="menu-card">
            <div className="menu-icon">{item.icon}</div>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

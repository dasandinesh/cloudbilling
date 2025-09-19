import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL_getbillsbycustomer } from '../url/url';

const CustomerHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer } = location.state || {};
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      if (!customer?._id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${URL_getbillsbycustomer}?customerId=${customer._id}`);
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch bills');
        console.error('Error fetching bills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [customer?._id]);

  if (!customer) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">No customer data found. Please go back and select a customer.</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Calculate total balance
  const totalBalance = bills.reduce((sum, bill) => sum + (bill.balance || 0), 0);
  const totalPaid = bills.reduce((sum, bill) => sum + ((bill.total || 0) - (bill.balance || 0)), 0);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back to List</button>
      </div>

      {/* Customer Information Card */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>{customer.name}</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
              <p><strong>GSTIN:</strong> {customer.gstin || 'N/A'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Address:</strong> {customer.door}, {customer.street}, {customer.area}, {customer.district}, {customer.state} - {customer.pincode}</p>
              <p><strong>Opening Balance:</strong> ₹{customer.oldBalance || '0.00'}</p>
              <p><strong>Current Balance:</strong> ₹{totalBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>Bill History</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : bills.length === 0 ? (
            <div className="alert alert-info">No bills found for this customer.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Bill No.</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id}>
                      <td>{bill.billNo}</td>
                      <td>{new Date(bill.date).toLocaleDateString()}</td>
                      <td>₹{bill.total?.toFixed(2)}</td>
                      <td>₹{((bill.total || 0) - (bill.balance || 0)).toFixed(2)}</td>
                      <td>₹{bill.balance?.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${bill.balance === 0 ? 'bg-success' : 'bg-warning'}`}>
                          {bill.balance === 0 ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => console.log('View bill:', bill._id)}
                        >
                          View
                        </button>
                        {bill.balance > 0 && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => console.log('Add payment for bill:', bill._id)}
                          >
                            Add Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="2">Total</th>
                    <th>₹{bills.reduce((sum, bill) => sum + (bill.total || 0), 0).toFixed(2)}</th>
                    <th>₹{totalPaid.toFixed(2)}</th>
                    <th>₹{totalBalance.toFixed(2)}</th>
                    <th colSpan="2"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h4>Quick Actions</h4>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2 d-md-flex">
            <button 
              className="btn btn-primary me-2"
              onClick={() => navigate('/saleentry', { state: { customer } })}
            >
              Create New Sale
            </button>
            {totalBalance > 0 && (
              <button 
                className="btn btn-success"
                onClick={() => console.log('Add payment for customer:', customer._id)}
              >
                Receive Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
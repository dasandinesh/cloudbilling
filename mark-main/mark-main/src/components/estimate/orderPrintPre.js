import React, { useEffect, useState } from "react";
import "./../order/orderprintpre.css";
import axios from "axios";

const OrderPrintPre = ({ selectedOrder, closeModal, companyId, userId }) => {
  const [billingTemplate, setBillingTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingTemplate = async () => {
      try {
        const response = await axios.get(`/api/billing/template?companyId=${companyId}`);
        if (response.data) {
          setBillingTemplate(response.data);
        }
      } catch (error) {
        console.error('Error fetching billing template:', error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchBillingTemplate();
    }
  }, [companyId]);

  // Calculate GST and totals
  const calculateTotals = () => {
    if (!selectedOrder?.products?.length) return {};
    
    const totals = {
      taxableValue: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    };

    selectedOrder.products.forEach(product => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseFloat(product.quantity) || 1;
      const cgstRate = (parseFloat(product.cgst) || 0) / 100;
      const sgstRate = (parseFloat(product.sgst) || 0) / 100;
      const igstRate = (parseFloat(product.igst) || 0) / 100;
      
      const itemTotal = price * quantity;
      const itemTaxableValue = itemTotal / (1 + cgstRate + sgstRate + igstRate);
      
      totals.taxableValue += itemTaxableValue;
      totals.cgst += itemTaxableValue * cgstRate;
      totals.sgst += itemTaxableValue * sgstRate;
      totals.igst += itemTaxableValue * igstRate;
      totals.total += itemTotal;
    });

    return {
      ...totals,
      taxableValue: totals.taxableValue.toFixed(2),
      cgst: totals.cgst.toFixed(2),
      sgst: totals.sgst.toFixed(2),
      igst: totals.igst.toFixed(2),
      total: totals.total.toFixed(2)
    };
  };

  const totals = calculateTotals();
  const currentDate = new Date().toLocaleDateString('en-IN');
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  if (!selectedOrder) {
    return (
      <div className="modal">
        <div className="modal-content" style={{ textAlign: 'center', padding: '20px' }}>
          <p>No order selected</p>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content gst-bill" style={{ maxWidth: '800px', padding: '20px' }}>
        <span 
          className="close" 
          onClick={closeModal} 
          style={{ 
            float: 'right', 
            cursor: 'pointer', 
            fontSize: '24px',
            marginTop: '-10px',
            marginRight: '-10px'
          }}
        >
          &times;
        </span>
        
        {/* Header with Logo and Company Info */}
        <div className="billing-header" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          {!loading && billingTemplate ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              {billingTemplate.logo && (
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <img 
                    src={billingTemplate.logo} 
                    alt="Company Logo" 
                    style={{ maxHeight: '80px', maxWidth: '200px' }} 
                  />
                </div>
              )}
              <div style={{ flex: 2, textAlign: billingTemplate.logo ? 'right' : 'center' }}>
                <h2 style={{ margin: '0', color: '#333' }}>{billingTemplate.companyName}</h2>
                {billingTemplate.address && <p style={{ margin: '5px 0', color: '#666' }}>{billingTemplate.address}</p>}
                {billingTemplate.contact && (
                  <div style={{ margin: '5px 0' }}>
                    {billingTemplate.contact.phone && <span style={{ marginRight: '10px' }}>📞 {billingTemplate.contact.phone}</span>}
                    {billingTemplate.contact.email && <span>✉️ {billingTemplate.contact.email}</span>}
                  </div>
                )}
                {billingTemplate.gstin && <p style={{ margin: '5px 0', fontWeight: 'bold' }}>GSTIN: {billingTemplate.gstin}</p>}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: '0', color: '#333' }}>Company Name</h2>
              <p style={{ margin: '5px 0', color: '#666' }}>Company Address</p>
              <p style={{ margin: '5px 0' }}>📞 Phone: +91 XXXXXXXXXX</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>GSTIN: XXAAAAA0000A1Z5</p>
            </div>
          )}
        </div>

        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0', color: '#2c3e50' }}>TAX INVOICE</h2>
            <p style={{ margin: '5px 0', color: '#7f8c8d' }}>#{invoiceNumber}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Date: {currentDate}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div style={{ 
          marginBottom: '20px', 
          backgroundColor: '#f9f9f9', 
          padding: '15px', 
          borderRadius: '5px',
          borderLeft: '4px solid #3498db'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Bill To:</h3>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{selectedOrder?.customerName || 'Customer Name'}</p>
          <p style={{ margin: '5px 0' }}>{selectedOrder?.customerAddress || 'Customer Address'}</p>
          <p style={{ margin: '5px 0' }}>GSTIN: {selectedOrder?.customerGstin || 'GSTIN Number'}</p>
          <p style={{ margin: '5px 0' }}>State: {selectedOrder?.customerState || 'State'}, Code: {selectedOrder?.stateCode || '--'}</p>
        </div>

        {/* Products Table */}
        <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>#</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Product</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>HSN/SAC</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Qty</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Rate (₹)</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>CGST %</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>SGST %</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>IGST %</th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder?.products?.map((product, index) => {
                const price = parseFloat(product.price) || 0;
                const quantity = parseFloat(product.quantity) || 1;
                const total = price * quantity;
                
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{index + 1}</td>
                    <td style={{ padding: '10px', textAlign: 'left' }}>{product.name || 'Product Name'}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{product.hsnCode || '--'}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{quantity}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{price.toFixed(2)}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{product.cgst || '0.00'}%</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{product.sgst || '0.00'}%</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{product.igst || '0.00'}%</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>{total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <div style={{ width: '350px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '500' }}>Taxable Amount:</span>
              <span>₹{totals.taxableValue || '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>CGST ({selectedOrder?.products?.[0]?.cgst || 0}%):</span>
              <span>₹{totals.cgst || '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>SGST ({selectedOrder?.products?.[0]?.sgst || 0}%):</span>
              <span>₹{totals.sgst || '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>IGST ({selectedOrder?.products?.[0]?.igst || 0}%):</span>
              <span>₹{totals.igst || '0.00'}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #ddd',
              fontWeight: 'bold',
              fontSize: '1.1em'
            }}>
              <span>Total Amount:</span>
              <span>₹{totals.total || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="billing-footer" style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '1px solid #eee',
          fontSize: '0.9em',
          color: '#666'
        }}>
          {!loading && billingTemplate ? (
            <>
              {billingTemplate.bankDetails && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Bank Details:</h4>
                  <p style={{ margin: '5px 0' }}><strong>Bank:</strong> {billingTemplate.bankDetails.bankName}</p>
                  <p style={{ margin: '5px 0' }}><strong>A/C No:</strong> {billingTemplate.bankDetails.accountNumber}</p>
                  <p style={{ margin: '5px 0' }}><strong>IFSC:</strong> {billingTemplate.bankDetails.ifscCode}</p>
                  <p style={{ margin: '5px 0' }}><strong>Branch:</strong> {billingTemplate.bankDetails.branch}</p>
                </div>
              )}
              
              {billingTemplate.termsAndConditions?.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Terms & Conditions:</h4>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {billingTemplate.termsAndConditions.map((term, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {billingTemplate.footerNote && (
                <div style={{ marginTop: '20px', textAlign: 'center', fontStyle: 'italic' }}>
                  <p>{billingTemplate.footerNote}</p>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p>Thank you for your business!</p>
              <p style={{ fontStyle: 'italic' }}>This is a computer-generated invoice. No signature required.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPrintPre;

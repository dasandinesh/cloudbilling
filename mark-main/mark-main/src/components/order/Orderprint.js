// Orderprint.js
import React, {  useEffect, useRef, useState } from "react";
import "./orderprintpre.css";
import axios from "axios";
import { URL_CompanyListGet } from "../url/url";

const Orderprint = ({ selectedOrder }) => {
  // Ref for accessing the modal
  const [companyInfo, setCompanyInfo] = useState({});
  const modalRef = useRef(null);
  console.log(selectedOrder);

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  const getCompanyInfo = async() => {
    try { 
      const companyInfo = await axios.get(URL_CompanyListGet);
      setCompanyInfo(companyInfo.data);
      console.log(companyInfo.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  // Inline CSS for page styling
  const pageStyle = `
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      .bill-container {
        width: 100%;
        max-width: none;
        box-shadow: none;
        border: 2px solid #000;
      }
    }
    .bill-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 2px solid #000;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .bill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
    .company-info {
      flex: 1;
      text-align: center;
    }
    .company-logo {
      width: 80px;
      height: 80px;
      border: 2px solid #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      margin: 0 20px;
    }
    .bill-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin: 15px 0;
      text-decoration: underline;
    }
    .bill-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .customer-details {
      flex: 1;
    }
    .bill-info {
      text-align: right;
    }
    .particulars-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .particulars-table th,
    .particulars-table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    .particulars-table th {
      background-color: #f0f0f0;
      font-weight: bold;
      text-align: center;
    }
    .amount-column {
      text-align: right;
    }
    .total-section {
      margin-top: 20px;
      border-top: 2px solid #000;
      padding-top: 15px;
    }
    .total-amount {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      padding: 10px;
      border: 2px solid #000;
      margin: 10px 0;
    }
    .footer-section {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #000;
    }
    .terms {
      flex: 1;
    }
    .signature {
      text-align: right;
      flex: 1;
    }
    .print-button {
      margin: 20px 0;
      text-align: center;
    }
    .print-button button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .print-button button:hover {
      background-color: #0056b3;
    }
  `;

  return (
    <div ref={modalRef}>
      <style>{pageStyle}</style>
      
      {/* Print Button */}
      <div className="print-button no-print">
        <button onClick={handlePrint}>🖨️ Print Bill</button>
      </div>

      {selectedOrder && (
        <div className="bill-container">
          {/* Header Section */}
          <div className="bill-header">
            <div className="company-logo">
              LOGO
            </div>
            <div className="company-info">
              <h2 style={{margin: '5px 0', fontSize: '20px'}}>{companyInfo.name}</h2>

              <div style={{fontSize: '12px', lineHeight: '1.4'}}>
                <div>Address Line 1:</div>
                <div>Address Line 2:</div>
              </div>
            </div>
            <div style={{textAlign: 'right', fontSize: '12px'}}>
              <div>Phone No:</div>
              <div>Bill No:</div>
            </div>
          </div>

          {/* Bill Title */}
          <div className="bill-title">
            BILL/CASH MEMO
          </div>

          {/* Bill Details */}
          <div className="bill-details">
            <div className="customer-details">
              <strong>To:</strong><br/>
              <div style={{marginTop: '10px'}}>
                <strong>{selectedOrder.customer.name}</strong><br/>
                {selectedOrder.customer.address && (
                  <div>{selectedOrder.customer.address}</div>
                )}
                {selectedOrder.customer.phone && (
                  <div>Phone: {selectedOrder.customer.phone}</div>
                )}
              </div>
            </div>
            <div className="bill-info">
              <strong>Date: {new Date(selectedOrder.bill_details.date).toLocaleDateString()}</strong>
            </div>
          </div>

          {/* Vehicle/Transport Details */}
          {selectedOrder.bill_details.transport && (
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px'}}>
              <div><strong>Vehicle No:</strong> {selectedOrder.bill_details.transport}</div>
              <div><strong>Type:</strong></div>
              <div><strong>Reading:</strong></div>
            </div>
          )}

          {/* Particulars Table */}
          <table className="particulars-table">
            <thead>
              <tr>
                <th style={{width: '8%'}}>Sl.No.</th>
                <th style={{width: '40%'}}>PARTICULARS</th>
                <th style={{width: '12%'}}>QTY</th>
                <th style={{width: '15%'}}>RATE</th>
                <th style={{width: '12%'}}>Amount Rs.</th>
                <th style={{width: '13%'}}>P.</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.products.map((product, index) => (
                <tr key={index}>
                  <td style={{textAlign: 'center'}}>{index + 1}</td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.comment && (
                      <div style={{fontSize: '12px', color: '#666'}}>{product.comment}</div>
                    )}
                    {product.scale && (
                      <div style={{fontSize: '11px'}}>Scale: {product.scale}</div>
                    )}
                  </td>
                  <td style={{textAlign: 'center'}}>{product.quantity}</td>
                  <td className="amount-column">₹{parseFloat(product.single_price || 0).toFixed(2)}</td>
                  <td className="amount-column">₹{parseFloat(product.price || 0).toFixed(2)}</td>
                  <td className="amount-column">
                    {product.bagprice && parseFloat(product.bagprice) > 0 && (
                      <div style={{fontSize: '10px'}}>B: ₹{parseFloat(product.bagprice).toFixed(2)}</div>
                    )}
                    {product.Wages && parseFloat(product.Wages) > 0 && (
                      <div style={{fontSize: '10px'}}>W: ₹{parseFloat(product.Wages).toFixed(2)}</div>
                    )}
                    {product.commission && parseFloat(product.commission) > 0 && (
                      <div style={{fontSize: '10px'}}>C: ₹{parseFloat(product.commission).toFixed(2)}</div>
                    )}
                  </td>
                </tr>
              ))}
              
              {/* Empty rows for spacing */}
              {Array.from({length: Math.max(0, 8 - selectedOrder.products.length)}).map((_, index) => (
                <tr key={`empty-${index}`} style={{height: '30px'}}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
              
              {/* Subtotals Row */}
              <tr style={{borderTop: '2px solid #000'}}>
                <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>TOTAL:</td>
                <td className="amount-column" style={{fontWeight: 'bold'}}>
                  ₹{parseFloat(selectedOrder.bill_details.subtotal || 0).toFixed(2)}
                </td>
                <td>&nbsp;</td>
              </tr>
              
              {/* Additional charges */}
              {selectedOrder.bill_details.totalbagprice && parseFloat(selectedOrder.bill_details.totalbagprice) > 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'right'}}>Bag Charges:</td>
                  <td className="amount-column">₹{parseFloat(selectedOrder.bill_details.totalbagprice).toFixed(2)}</td>
                  <td>&nbsp;</td>
                </tr>
              )}
              
              {selectedOrder.bill_details.totalWages && parseFloat(selectedOrder.bill_details.totalWages) > 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'right'}}>Wages:</td>
                  <td className="amount-column">₹{parseFloat(selectedOrder.bill_details.totalWages).toFixed(2)}</td>
                  <td>&nbsp;</td>
                </tr>
              )}
              
              {selectedOrder.bill_details.totalcommission && parseFloat(selectedOrder.bill_details.totalcommission) > 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'right'}}>Commission:</td>
                  <td className="amount-column">₹{parseFloat(selectedOrder.bill_details.totalcommission).toFixed(2)}</td>
                  <td>&nbsp;</td>
                </tr>
              )}
              
              {selectedOrder.bill_details.transport && parseFloat(selectedOrder.bill_details.transport) > 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'right'}}>Transport:</td>
                  <td className="amount-column">₹{parseFloat(selectedOrder.bill_details.transport).toFixed(2)}</td>
                  <td>&nbsp;</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total Amount Section */}
          <div className="total-amount">
            TOTAL AMOUNT: ₹{parseFloat(selectedOrder.bill_details.bill_amount || 0).toFixed(2)}
          </div>

          {/* Payment Details */}
          {(selectedOrder.bill_details.cash || selectedOrder.bill_details.credit) && (
            <div style={{margin: '15px 0', fontSize: '14px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {selectedOrder.bill_details.cash && (
                  <div><strong>Cash Paid:</strong> ₹{parseFloat(selectedOrder.bill_details.cash).toFixed(2)}</div>
                )}
                {selectedOrder.bill_details.credit && (
                  <div><strong>Credit:</strong> ₹{parseFloat(selectedOrder.bill_details.credit).toFixed(2)}</div>
                )}
              </div>
              {selectedOrder.bill_details.new_balance && (
                <div style={{textAlign: 'center', marginTop: '10px', fontWeight: 'bold'}}>
                  <strong>New Balance:</strong> ₹{parseFloat(selectedOrder.bill_details.new_balance).toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Footer Section */}
          <div className="footer-section">
            <div className="terms">
              <strong>Terms and Conditions</strong>
              <div style={{fontSize: '12px', marginTop: '5px'}}>
                • Payment due within 30 days<br/>
                • Goods once sold will not be taken back<br/>
                • Subject to local jurisdiction
              </div>
            </div>
            <div className="signature">
              <div style={{marginBottom: '50px'}}>
                <strong>For Company Name</strong>
              </div>
              <div style={{borderTop: '1px solid #000', paddingTop: '5px'}}>
                <strong>Authorized Signatory</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orderprint;
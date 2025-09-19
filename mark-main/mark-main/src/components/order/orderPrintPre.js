
import React, { useEffect, useState } from "react";
import "./orderprintpre.css";
import axios from "axios";
import { URL_CompanyListGet } from "../url/url";

const OrderPrintPre = ({ selectedOrder, closeModal }) => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(URL_CompanyListGet);
        console.log("Company API Response:", response.data);
        
        // Handle both array and single object responses
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCompanyInfo(response.data[0]);
        } else if (response.data && typeof response.data === 'object') {
          setCompanyInfo(response.data);
        } else {
          console.warn("Unexpected company data format:", response.data);
          setCompanyInfo(null);
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
        setError(error.message);
        setCompanyInfo(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyInfo();
  }, []);

  const handlePrint = () => {
    const printContent = document.querySelector(".bill-container").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Order Bill</title>
          <style>
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
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {loading && (
          <div style={{padding: '20px', textAlign: 'center'}}>
            <p>Loading company information...</p>
          </div>
        )}
        
        {error && (
          <div style={{padding: '20px', textAlign: 'center', color: 'red'}}>
            <p>Error loading company info: {error}</p>
          </div>
        )}
        
        {selectedOrder && !loading && (
          <div className="bill-container">
            {/* Header Section */}
            <div className="bill-header">
              <div className="company-logo">
                {companyInfo?.logo ? (
                  <img src={companyInfo.logo} alt="Company Logo" style={{maxHeight: '50px'}} />
                ) : (
                  "LOGO"
                )}
              </div>
              <div className="company-info">
                <h2 style={{margin: '5px 0', fontSize: '20px'}}>
                  {companyInfo?.name || "COMPANY NAME"}
                </h2>
                <div style={{fontSize: '12px', lineHeight: '1.4'}}>
                  <div>
                    {companyInfo?.selectedBranch?.address?.doorno || ''} {companyInfo?.selectedBranch?.address?.street || 'Address Line 1'}
                  </div>
                  <div>
                    {companyInfo?.selectedBranch?.address?.places || ''} {companyInfo?.selectedBranch?.address?.district || 'Address Line 2'}
                  </div>
                  <div>
                    {companyInfo?.selectedBranch?.address?.pincode || ''}
                  </div>
                </div>
              </div>
              <div style={{textAlign: 'right', fontSize: '12px'}}>
                <div>Phone: {companyInfo?.phone || 'N/A'}</div>
                <div>Email: {companyInfo?.email || 'N/A'}</div>
                <div>Bill No: {selectedOrder?.bill_details?.bill_number || 'N/A'}</div>
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

        <div className="button-wrapper no-print">
          <button onClick={closeModal} className="button button-secondary">
            Close
          </button>
          <button
            onClick={handlePrint}
            className="button button-primary print-button"
          >
            🖨️ Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPrintPre;

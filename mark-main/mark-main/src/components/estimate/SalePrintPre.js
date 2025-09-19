import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import './SalePrintPre.css';

const SalePrintPre = ({ show, handleClose, sale, companyInfo }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (!sale) {
        return null;
    }

    // Fallback for missing company info
    const companyName = companyInfo?.name || "COMPANY NAME";
    const companyLogo = companyInfo?.logo;
    const companyPhone = companyInfo?.phone || "123-456-7890";
    const companyEmail = companyInfo?.email || "contact@example.com";
    const branchAddress = companyInfo?.selectedBranch?.address || {};
    const { doorno, street, places, district, pincode } = branchAddress;
    const fullAddress = `${doorno || ''} ${street || ''}, ${places || ''}, ${district || ''} - ${pincode || ''}`.trim();

    const { customer, products, bill_details } = sale;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Sale Bill Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div ref={componentRef} className="sale-bill-container p-4">
                    <header className="bill-header text-center mb-4">
                        {companyLogo && <img src={companyLogo} alt="Company Logo" className="company-logo mb-2" />}
                        <h1>{companyName}</h1>
                        <p>{fullAddress}</p>
                        <p>Phone: {companyPhone} | Email: {companyEmail}</p>
                        <hr />
                        <h2>SALE BILL</h2>
                    </header>
                    <section className="customer-details d-flex justify-content-between mb-4">
                        <div>
                            <strong>Billed to:</strong>
                            <p>{customer?.name || 'N/A'}</p>
                        </div>
                        <div>
                            <strong>Bill No:</strong> {sale._id ? sale._id.slice(-6).toUpperCase() : 'N/A'}
                            <br />
                            <strong>Date:</strong> {new Date(bill_details?.bill_date).toLocaleDateString()}
                        </div>
                    </section>
                    <section className="products-table mb-4">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product Name</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.quantity}</td>
                                        <td>{parseFloat(product.single_price).toFixed(2)}</td>
                                        <td>{parseFloat(product.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    <section className="bill-summary d-flex justify-content-end">
                        <div className="summary-box">
                            <div className="summary-item">
                                <span>Subtotal:</span>
                                <span>{parseFloat(bill_details?.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="summary-item">
                                <span>Transport:</span>
                                <span>{parseFloat(bill_details?.transport || 0).toFixed(2)}</span>
                            </div>
                             <div className="summary-item total">
                                <span>Total Amount:</span>
                                <span>{parseFloat(bill_details?.bill_amount || 0).toFixed(2)}</span>
                            </div>
                            <hr/>
                             <div className="summary-item">
                                <span>Old Balance:</span>
                                <span>{parseFloat(bill_details?.old_balance || 0).toFixed(2)}</span>
                            </div>
                             <div className="summary-item">
                                <span>Cash Paid:</span>
                                <span>{parseFloat(bill_details?.cash || 0).toFixed(2)}</span>
                            </div>
                             <div className="summary-item">
                                <span>Credit:</span>
                                <span>{parseFloat(bill_details?.credit || 0).toFixed(2)}</span>
                            </div>
                            <div className="summary-item total">
                                <span>New Balance:</span>
                                <span>{parseFloat(bill_details?.new_balance || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                    <footer className="bill-footer text-center mt-4">
                        <p>Thank you for your business!</p>
                    </footer>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handlePrint}>
                    Print
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SalePrintPre;

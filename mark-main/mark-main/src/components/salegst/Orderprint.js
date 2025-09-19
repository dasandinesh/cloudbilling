// Orderprint.js
import React, { useRef } from "react";
import "./orderprintpre.css";

const Orderprint = ({ selectedOrder }) => {
  // Ref for accessing the modal
  const modalRef = useRef(null);
  console.log(selectedOrder);
  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Inline CSS for page styling
  const pageStyle = `@page {
    size: 210mm 148mm;
  }
  @media print {
    @page {  
      size: a5 landscape;
      margin: 0mm !important;
    }
    @media all {
      .pagebreak {
        overflow: visible; 
      }
    }
  }`;

  return (
    <div ref={modalRef}>
      <style>{pageStyle}</style>
      <div>
        <h2>Order</h2>
        {selectedOrder && (
          <div>
            {/* Render customer details */}
            <div className="row">
              <div className="col-6">
                <table>
                  <tbody>
                    <tr>
                      <td>Customer Name:</td>
                      <td>{selectedOrder.customer.name}</td>
                    </tr>
                    <tr>
                      <td>Order Date:</td>
                      <td>{selectedOrder.bill_details.date}</td>
                    </tr>
                    <tr>
                      <td>Bill Date:</td>
                      <td>{selectedOrder.bill_details.bill_date}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Render product details */}
            <h3>Products:</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Single Price</th>
                    <th>Scale</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.single_price}</td>
                      <td>{product.scale}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Render print button */}
            <div>
              <button onClick={handlePrint}>Print</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orderprint;

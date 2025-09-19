import React from "react";
import "./orderprintpre.css";

const OrderPrintPre = ({ selectedOrder, closeModal }) => {
  const handlePrint = () => {
    const printContent = document.querySelector(".modal-content").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Order</title>
          <style>
            @media print {
              body * {
                visibility: hidden;
              }
              .modal-content, .modal-content * {
                visibility: visible;
              }
              .modal-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .modal-content {
              padding: 20px;
            }
            .row {
              display: flex;
              flex-wrap: wrap;
              margin: 0 -15px;
            }
            .col {
              flex: 1;
              padding: 0 15px;
            }
            .table-wrapper table {
              width: 95%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .table-wrapper th, .table-wrapper td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            .button-wrapper {
              margin-top: 20px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              cursor: pointer;
              text-align: center;
              text-decoration: none;
              border: none;
              border-radius: 4px;
              margin-right: 10px;
            }
            .button-primary {
              background-color: #007bff;
              color: white;
            }
            .button-secondary {
              background-color: #6c757d;
              color: white;
            }
            .print-button {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="modal-content">
            ${printContent}
          </div>
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
        <center>
          <h2>Order</h2>
        </center>
        <hr />
        {selectedOrder && (
          <div>
            <div className="row">
              <div className="col">
                <div>
                  <b>Party name:</b>
                  <div>{selectedOrder.customer.name}</div>
                </div>
              </div>
              <div className="col">
                <div>
                  <b>Billed Date:</b>
                  <div>{selectedOrder.bill_details.date}</div>
                </div>
              </div>
              <div className="col">
                <div>
                  <b>Deliver Date:</b>
                  <div>{selectedOrder.bill_details.bill_date}</div>
                </div>
              </div>
            </div>
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
            <table>
              <tbody>
                <tr>
                  <th>{selectedOrder.bill_details.bill_date}</th>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="button-wrapper">
          <button onClick={closeModal} className="button button-secondary">
            Close
          </button>
          <button
            onClick={handlePrint}
            className="button button-primary print-button"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPrintPre;

import "./../order/orderprintpre.css";
import React, { useRef, useState } from "react";

const BillPrew = ({ selectedOrder, closeModal }) => {
  const modalRef = useRef(null);
  const [printFormat, setPrintFormat] = useState("A4");

  const handlePrint = () => {
    if (modalRef.current) {
      let printContent;
      let printStyle;

      if (printFormat === "A4") {
        printContent = renderA4Template();
        printStyle = getA4CSS();
      } else if (printFormat === "A5") {
        printContent = renderA5Template();
        printStyle = getA5CSS();
      } else if (printFormat === "3inch") {
        printContent = render3InchTemplate();
        printStyle = get3InchCSS();
      }

      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Order</title>
            <style>
              ${printStyle}
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
    }
  };

  if (!selectedOrder) {
    return null; // If billData is null or undefined, do not render anything
  }

  const { customer, products, bill_details, serial_number } = selectedOrder;
  const renderA4Template = () => {
    return `
      <center><h4>Estimate (A4)</h4></center>
      <hr />
       <div class="company-info">
        <h2>P.P MARKETING</h2>
        <address class="address">
          399, NADAR MIDDLE STREET, MELAPATTAMUDAYARPURAM, TENKASI DT - 627861.<br>
          Ph: 9943631639, 6380840327.<br>
          Email: p.p.marketing@gmail.com<br>
          GSTIN: 33FQRPP5415G1ZJ.
        </address>
      </div>
      <div>
        <div class="row">
          <div class="col"><b>Party name:</b><div>${customer.name}</div></div>
          <div class="col"><b>Billed Date:</b><div>${
            bill_details.date
          }</div></div>
          <div class="col"><b>Deliver Date:</b><div>${
            bill_details.bill_date
          }</div></div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Product Name</th><th>Single Price</th><th>Scale</th><th>Quantity</th><th>Total Price</th></tr></thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.single_price}</td>
                  <td>${product.scale}</td>
                  <td>${product.quantity}</td>
                  <td>${product.price}</td>
                </tr>
              `
                )
                .join("")}
                   <tr key="">
                  <td>Total</td>
                  <td>{}</td>
                  <td>{}</td>
                  <td>${bill_details.total_quantity}</td>
                  <td>${bill_details.bill_amount}</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  const renderA5Template = () => {
    return `
      <center><h4>Estimate (A5)</h4></center>
      <hr />
      <center>
      <div class="company-info">
        <h2>P.P MARKETING</h2>
        <address class="address">
          399, NADAR MIDDLE STREET, MELAPATTAMUDAYARPURAM, TENKASI DT - 627861.<br>
          Ph: 9943631639, 6380840327.<br>
          Email: p.p.marketing@gmail.com<br>
          GSTIN: 33FQRPP5415G1ZJ.
        </address>
      </div></center>
      
      <div>
        <div class="row">
          <div class="col"><b>Party name:</b><div>${customer.name}</div></div>
          <div class="col"><b>Billed Date:</b><div>${
            bill_details.date
          }</div></div>
          <div class="col"><b>Deliver Date:</b><div>${
            bill_details.bill_date
          }</div></div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Product Name</th><th>Single Price</th><th>Scale</th><th>Quantity</th><th>Total Price</th></tr></thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.single_price}</td>
                  <td>${product.scale}</td>
                  <td>${product.quantity}</td>
                  <td>${product.price}</td>
                </tr>
              `
                )
                .join("")}
                   <tr key="">
                  <td>Total</td>
                  <td>{}</td>
                  <td>{}</td>
                  <td>${bill_details.total_quantity}</td>
                  <td>${bill_details.bill_amount}</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  };
  const render3InchTemplate = () => {
    return `
     <center>
       <h1>AFC</h1>
      <b>(Alangulam Fried Chicken)</b>
      <div class="company-info">
        <address class="address">
          Ambai Road, Near Selva Skilks,<br>
          Alangulam.<br>
          Ph: 8220544602, 8681994602.<br>
        </address>
      </div></center>
      <hr>
    <div>
      <div class="row date">
        <div class="col"><b>Party name:</b><div>${customer.name}</div></div>
        
        <div class="col"><b>Bill Date:</b>
        <div>${bill_details.bill_date}</div>
        <div>${serial_number}</div>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
             <tr>
              <td colspan="4" style="text-align: center;">--------------------------------------------------------------------------------</td>
            </tr>
            <tr><th>QT</th><th>Product Name</th><th>RATE</th><th>AMOUNT</th></tr>
            <tr>
              <td colspan="4" style="text-align: center;">--------------------------------------------------------------------------------</td>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
               <td>${product.single_price}</td>
                <td>${product.name}</td>
               
                <td>${Math.round(product.quantity)}</td>
                <td>${Math.round(product.price)}</td>
              </tr>
            `
              )
              .join("")}
               <tr>
              <td colspan="4" style="text-align: center;">--------------------------------------------------------------------------------</td>
            </tr>
            <tr key="">
              <td>Total</td>
              <td></td>
              <td>${bill_details.total_quantity}</td>
              <td>${Math.round(bill_details.bill_amount)}</td>
            </tr>
            <tr>
              <td colspan="4" style="text-align: center;">--------------------------------------------------------------------------------</td>
            </tr>
          </tbody>
        </table>
        <div>
        <table>
        <tr><th>Total Nos:</th><th>Total QT:${
          bill_details.total_quantity
        }</th></tr>
        <tr><th>Total Nos:</th></tr>

        </table>
        </div>
      </div>
    </div>
  `;
  };

  const getA4CSS = () => {
    return `
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
        border: 1px solid black;
        border-collapse: collapse;
      }
         .company-info {
            text-align: center;
            margin-bottom: 30px;
        }

        .company-info h4 {
            margin-bottom: 5px;
        }

        .address {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 10px;
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
      @page {
        size: A4;
      }
    `;
  };

  const getA5CSS = () => {
    return `
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
        border: 1px solid black;
        border-collapse: collapse;
      }
         .company-info {
            text-align: center;
            margin-bottom: 15px;
        }

        .address {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 5px;
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
      @page {
        size: A5 ;
      }
    `;
  };

  const get3InchCSS = () => {
    return `
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
          margin-left: 0%;
          margin-right: 0%;
        }
      }
      body {
        font-family: Arial, sans-serif;
        padding: 10px;
      }
      .modal-content {
        padding: 3px;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -2px;
      }
      .col {
        flex: 1;
        padding: 0 2px;
      }
      .table-wrapper table {
        width: 99%;
        margin: 3px 0;
        font-size: 10px;
      }
      .table-wrapper th, .table-wrapper td {
        padding: 2px;
        text-align: left;
      }
      .company-info {
        text-align: center;
      }
    
      .address {
        font-size: 12px;
        line-height: 1.5;
      }
      .button-wrapper {
        margin-top: 0px;
      }
      .date {
        margin: 10px;
        text-align: center;
        font-size: 12px;

      }
      .button {
        display: inline-block;
        padding: 2px 5px;
        font-size: 6px;
        cursor: pointer;
        text-align: center;
        text-decoration: none;
        border: none;
        border-radius: 2px;
        margin-right: 3px;
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
      @page {
        size: 80mm auto;
      }
    `;
  };

  return (
    <div className="modal">
      <div ref={modalRef} className="modal-content">
        <center>
          <h2>Estimate</h2>
        </center>
        <hr />
        <div>
          <div className="row">
            <div className="col">
              <div>
                <b>Party name:</b>
                <div>{customer.name}</div>
              </div>
            </div>
            <div className="col">
              <div>
                <b>Billed Date:</b>
                <div>{bill_details.date}</div>
              </div>
            </div>
            <div className="col">
              <div>
                <b>Deliver Date:</b>
                <div>{bill_details.bill_date}</div>
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
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.single_price}</td>
                    <td>{product.scale}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
                <tr key="">
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td>{bill_details.total_quantity}</td>
                  <td>{bill_details.bill_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="button-wrapper">
          <div>
            <label>Print Format:</label>
            <select
              id="print-format"
              value={printFormat}
              onChange={(e) => setPrintFormat(e.target.value)}
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="3inch">3-inch Receipt</option>
            </select>
          </div>

          <button onClick={handlePrint} className="button button-primary">
            Print
          </button>
          <button onClick={closeModal} className="button button-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPrew;

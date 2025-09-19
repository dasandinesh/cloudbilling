import React, { useRef } from "react";
import "./../order/orderprintpre.css";
// For PDF export
// These imports require installing dependencies: jspdf and html2canvas
// npm i jspdf html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formatCurrency = (n) => {
  const num = parseFloat(n || 0);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const PurchasePrintPre = ({ bill, onClose }) => {
  const printAreaRef = useRef(null);
  if (!bill) return null;

  const { customer = {}, bill_details = {}, products = [] } = bill;

  const subtotal = parseFloat(bill_details.bill_amount || 0) || 0;
  const transport = parseFloat(bill_details.transport || 0) || 0;
  const discount = parseFloat(bill_details.discount || 0) || 0;
  const roundoff = parseFloat(bill_details.round_off || 0) || 0;
  const grandTotal = subtotal - discount + transport + roundoff;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const input = printAreaRef.current;
      if (!input) return;
      // Render the visible area to canvas
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      // A4 size in jsPDF is 210 x 297 mm. In points it's ~595 x 842.
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 40; // 20pt margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 20;
      if (imgHeight < pageHeight - 40) {
        pdf.addImage(imgData, "PNG", 20, y, imgWidth, imgHeight, undefined, "FAST");
      } else {
        // Multi-page rendering
        let remainingHeight = imgHeight;
        let position = 20;
        const canvasPageHeight = (canvas.height * imgWidth) / canvas.width;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight, undefined, "FAST");
          remainingHeight -= pageHeight;
          if (remainingHeight > 0) {
            pdf.addPage();
            position = 0;
          }
        }
      }

      const fileName = `Purchase_Bill_${bill?.bill_details?.bill_no || "preview"}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error("Download PDF failed", e);
      alert("Failed to generate PDF. Please try Print to PDF if the issue persists.");
    }
  };

  const handleCopy = async () => {
    try {
      const text = `Purchase Bill\n\n` +
        `Supplier: ${customer.name || ""}\n` +
        `Bill No: ${bill_details.bill_no || ""}\n` +
        `Bill Date: ${bill_details.bill_date || ""}\n` +
        `GSTIN: ${bill_details.supplier_gstin || ""}\n\n` +
        `Items:\n` +
        products
          .map(
            (p, i) =>
              `${i + 1}. ${p.name || ""} | HSN: ${p.hsn || ""} | Qty: ${p.quantity || 0} | Rate: ${formatCurrency(
                p.single_price
              )} | Taxable: ${formatCurrency((parseFloat(p.quantity||0)*parseFloat(p.single_price||0)))} | CGST: ${formatCurrency(
                p.cgst
              )} | SGST: ${formatCurrency(p.Sgst)} | Total: ${formatCurrency(p.price)}`
          )
          .join("\n") +
        `\n\nGST Summary:\n` +
        Object.entries(bill_details.gstgrouppycatagry || {})
          .map(
            ([k, v]) =>
              `${k}% -> Taxable: ${formatCurrency(v.taxableAmount)} | CGST: ${formatCurrency(
                v.cgst
              )} | SGST: ${formatCurrency(v.sgst)} | Total: ${formatCurrency(v.totalAmount)}`
          )
          .join("\n") +
        `\n\nSubtotal: ${formatCurrency(subtotal)}\n` +
        `Discount: ${formatCurrency(discount)}\n` +
        `Transport: ${formatCurrency(transport)}\n` +
        `Round-off: ${formatCurrency(roundoff)}\n` +
        `Grand Total: ${formatCurrency(grandTotal)}\n\n` +
        `Payment Mode: ${bill_details.payment_mode || ""}\n` +
        `Payment Ref: ${bill_details.payment_ref || ""}\n` +
        `Notes: ${bill_details.notes || ""}`;

      await navigator.clipboard.writeText(text);
      alert("Bill copied to clipboard");
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" ref={printAreaRef}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Purchase Bill Preview</h2>

        <div className="row">
          <div className="col-6">
            <address className="bill-to">
              <p><strong>Supplier:</strong> {customer.name}</p>
              {customer && (
                <>
                  <p>
                    {customer.door && `${customer.door}, `}
                    {customer.street && `${customer.street}, `}
                    {customer.area && `${customer.area}, `}
                  </p>
                  <p>
                    {customer.district && `${customer.district}, `}
                    {customer.state && `${customer.state}`}
                  </p>
                  {customer.pincode && (
                    <p>
                      <label>Pin:</label> {customer.pincode}
                    </p>
                  )}
                  {customer.phone && (
                    <p>
                      <label>Phone:</label> {customer.phone}
                    </p>
                  )}
                </>
              )}
            </address>
          </div>
          <div className="col-6">
            <table>
              <tbody>
                <tr>
                  <td>Bill No</td>
                  <td>{bill_details.bill_no}</td>
                </tr>
                <tr>
                  <td>Bill Date</td>
                  <td>{bill_details.bill_date}</td>
                </tr>
                <tr>
                  <td>GSTIN</td>
                  <td>{bill_details.supplier_gstin}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3>Items</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const qty = parseFloat(p.quantity || 0) || 0;
                const rate = parseFloat(p.single_price || 0) || 0;
                const taxable = qty * rate;
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.hsn}</td>
                    <td>{qty}</td>
                    <td>{formatCurrency(rate)}</td>
                    <td>{formatCurrency(taxable)}</td>
                    <td>{formatCurrency(p.cgst)}</td>
                    <td>{formatCurrency(p.Sgst)}</td>
                    <td>{formatCurrency(p.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h4>GST Summary</h4>
            <table>
              <thead>
                <tr>
                  <th>Rate</th>
                  <th>Taxable</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bill_details.gstgrouppycatagry || {}).map(
                  ([rate, v], idx) => (
                    <tr key={idx}>
                      <td>{rate}%</td>
                      <td>{formatCurrency(v.taxableAmount)}</td>
                      <td>{formatCurrency(v.cgst)}</td>
                      <td>{formatCurrency(v.sgst)}</td>
                      <td>{formatCurrency(v.totalAmount)}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h4>Totals</h4>
            <table>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td>{formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                  <td>Discount</td>
                  <td>{formatCurrency(discount)}</td>
                </tr>
                <tr>
                  <td>Transport</td>
                  <td>{formatCurrency(transport)}</td>
                </tr>
                <tr>
                  <td>Round-off</td>
                  <td>{formatCurrency(roundoff)}</td>
                </tr>
                <tr>
                  <th>Grand Total</th>
                  <th>{formatCurrency(grandTotal)}</th>
                </tr>
              </tbody>
            </table>

            <h4>Payment</h4>
            <table>
              <tbody>
                <tr>
                  <td>Mode</td>
                  <td>{bill_details.payment_mode || ""}</td>
                </tr>
                <tr>
                  <td>Reference</td>
                  <td>{bill_details.payment_ref || ""}</td>
                </tr>
              </tbody>
            </table>

            {bill_details.notes && (
              <div>
                <h4>Notes</h4>
                <p>{bill_details.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="buttonb" onClick={handlePrint}>Print / Download PDF</button>
          <button className="buttonb" onClick={handleDownloadPDF}>Download PDF (direct)</button>
          <button className="buttonb" onClick={handleCopy}>Copy Summary</button>
          <button className="buttonb" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePrintPre;

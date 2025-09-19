import React from "react";

const ReceiptModal = ({
  show,
  onClose,
  onSubmit,
  customerName,
  setCustomerName,
  date,
  setDate,
  amount,
  setAmount,
  description,
  setDescription,
  category,
  setCategory,
  payMethod,
  setPayMethod,
  paymentMethods,
  error,
  success,
}) => {
  if (!show) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <center>
          <h2>Receipt Entry</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={onSubmit}>
            <div>
              <label>Customer Name:</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div>
              <label>Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label>Amount:</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
              <label>Description:</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <label>Category:</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
              <label>Pay Method:</label>
              <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} required>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>
            <button type="submit">Add Receipt</button>
          </form>
        </center>
      </div>

      <style jsx>{`
        .modal {
          display: flex;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: #fff;
          padding: 25px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          position: relative;
        }
        .close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 28px;
          color: #aaa;
          cursor: pointer;
        }
        form div {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input, select {
          width: 100%;
          padding: 8px;
        }
        button {
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;

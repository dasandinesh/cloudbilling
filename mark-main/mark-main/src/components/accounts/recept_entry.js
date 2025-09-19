import React, { useState } from "react";
import axios from "axios";
import { URL_new_receipt } from "../url/url";

const ReceiptEntry = () => {
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (amount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    const newReceipt = { customerName, date, amount, description, category };

    try {
      const response = await axios.post(URL_new_receipt, newReceipt);
      setReceipts([...receipts, response.data]);
      setCustomerName("");
      setDate("");
      setAmount("");
      setDescription("");
      setCategory("");
      setSuccess("Receipt added successfully!");
      handleClose();
    } catch (error) {
      setError("Error adding the receipt");
      console.error("Error adding the receipt:", error);
    }
  };

  return (
    <div>
      <button onClick={handleShow}>Add Receipt</button>

      {showModal && (
        <div className="modal" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleClose}>
              &times;
            </span>
            <h1>Receipt Entry</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
              <div>
                <label>Customer Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Category:</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Add Receipt</button>
            </form>
          </div>
        </div>
      )}

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
          background-color: rgba(0, 0, 0, 0.4);
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: #fefefe;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 500px;
          position: relative;
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          position: absolute;
          top: 10px;
          right: 15px;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ReceiptEntry;

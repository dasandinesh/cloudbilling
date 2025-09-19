import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL_get_receipt, URL_new_receipt } from "../url/url";
import ReceiptModal from"./ReceiptModel";
import "./receipt.css";

const ReceiptList = () => {
  const [receiptList, setReceiptList] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const paymentMethods = [
    { value: "", label: "Payment Method" },
    { value: "cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Netbanking", label: "Netbanking" },
    { value: "paypal", label: "PayPal" },
  ];

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(URL_get_receipt);
        setReceiptList(res.data);
        setFilteredReceipts(res.data);
      } catch (err) {
        console.error("Error fetching receipts:", err);
      }
    };
    fetchReceipts();
  }, []);

  useEffect(() => {
    filterReceipts();
  }, [fromDate, toDate, receiptList]);

  const handleClose = () => {
    setShowModal(false);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("Amount must be positive");
      return;
    }
    try {
      const newReceipt = {
        customerName,
        date,
        amount,
        description,
        category,
        payMethod,
      };
      const res = await axios.post(URL_new_receipt, newReceipt);
      setReceiptList([...receiptList, res.data]);
      setCustomerName("");
      setDate("");
      setAmount("");
      setDescription("");
      setCategory("");
      setPayMethod("");
      setSuccess("Receipt added successfully");
      handleClose();
    } catch (err) {
      setError("Error saving receipt");
    }
  };

  const filterReceipts = () => {
    const filtered = receiptList.filter((r) => {
      const receiptDate = new Date(r.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (from && to) return receiptDate >= from && receiptDate <= to;
      if (from) return receiptDate >= from;
      if (to) return receiptDate <= to;
      return true;
    });
    setFilteredReceipts(filtered);
  };

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <h2 className="receipt-title">Receipt Management</h2>
        <div className="receipt-actions">
          <button onClick={() => setShowModal(true)}>Add Receipt</button>
        </div>
      </div>

      <div className="receipt-filters">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div className="receipt-table-wrapper">
        <table className="receipt-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th>Description</th>
              <th>Category</th>
              <th>Pay Method</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((r, i) => (
              <tr key={i}>
                <td data-label="Name">{r.customerName}</td>
                <td data-label="Date">{r.date?.substring(0, 10)}</td>
                <td data-label="Amount" className="text-right">{r.amount}</td>
                <td data-label="Description">{r.description}</td>
                <td data-label="Category">{r.category}</td>
                <td data-label="Pay Method">{r.payMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReceiptModal
        show={showModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        customerName={customerName}
        setCustomerName={setCustomerName}
        date={date}
        setDate={setDate}
        amount={amount}
        setAmount={setAmount}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        payMethod={payMethod}
        setPayMethod={setPayMethod}
        paymentMethods={paymentMethods}
        error={error}
        success={success}
      />
    </div>
  );
};

export default ReceiptList;

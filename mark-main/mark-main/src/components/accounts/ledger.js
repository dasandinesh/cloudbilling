import React, { useEffect, useState } from "react";
import { ledger_get } from "../url/url";
import axios from "axios";

const Ledger = () => {
  const [accountRecords, setAccountRecords] = useState([]);

  useEffect(() => {
    const getReceiptList = async () => {
      try {
        const response = await axios.get(ledger_get);
        setAccountRecords(response.data);
      } catch (error) {
        console.error("Error fetching the receipt list:", error);
      }
    };

    getReceiptList();
  }, []);

  return (
    <div>
      <h1>Account Records</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Description</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Serial Number</th>
          </tr>
        </thead>
        <tbody>
          {accountRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.customer_name}</td>
              <td>{record.description}</td>
              <td>{record.credit}</td>
              <td>{record.debit}</td>
              <td>{record.serial_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ledger;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../order/orderprintpre.css";
import { URL_addcustomer, URL_getallcustomer } from "../url/url";

const Customer = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    createDate: "",
    phone: "",
    door: "",
    street: "",
    area: "",
    district: "",
    state: "",
    pincode: "",
    oldBalance: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(URL_getallcustomer);
      setCustomerList(res.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  const addCustomer = async () => {
    try {
      await axios.post(URL_addcustomer, newCustomer);
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomer();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL_getallcustomer}/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`${URL_getallcustomer}/${id}`, newCustomer);
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error("Error editing customer:", error);
    }
  };  
const handleView = async (id) => {
    try {
      const response = await axios.get(`${URL_getallcustomer}/${id}`);
      console.log("Customer details:", response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  return (
    <>
      <h3>Customer List</h3>
      <div className="row">
        <div className="col-6">
          <label>Search customer</label>
          <input type="text" />
        </div>
        <div className="col-6">
          <button onClick={openModal}>Add</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Create Date</th>
            <th>Phone</th>
            <th>Address</th>
            <th>oldBalance</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.createDate}</td>
              <td>{customer.phone}</td>
              <td>
                {customer.door}, {customer.street}, {customer.area},{" "}
                {customer.district}, {customer.state} - {customer.pincode}
              </td>
              <td>{customer.oldBalance}</td>

              <td>
                {/* Buttons for handling edit and views */}
                <button onClick={() => navigate('/customerhome', { state: { customer } })}>
                  View
                </button>
                <button onClick={() => console.log("Edit:", customer)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding a new customer */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Add Customer</h2>
            <form onSubmit={addCustomer}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newCustomer.name}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="createDate"
                placeholder="Create Date"
                value={newCustomer.createDate}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="door"
                placeholder="Door"
                value={newCustomer.door}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={newCustomer.street}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="area"
                placeholder="Area"
                value={newCustomer.area}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={newCustomer.district}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={newCustomer.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={newCustomer.pincode}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="oldBalance"
                placeholder="oldBalance"
                value={newCustomer.oldBalance}
                onChange={handleInputChange}
              />
              <button type="submit">Add Customer</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Customer;

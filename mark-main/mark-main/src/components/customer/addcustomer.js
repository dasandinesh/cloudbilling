import React, { useState } from "react";
import { URL_PRO } from "../url/url";
import axios from "axios";

const AddCustomer = () => {
  const [Name, SetName] = useState("");
  const [createDate, setCreateDate] = useState(
    new Date().toISOString().slice(0, 10)
  ); // Initialize with current date
  const [phone, Setphone] = useState("");
  const [door, Setdoor] = useState("");
  const [Street, SetStreet] = useState("");
  const [Area, SetArea] = useState("");
  const [district, Setdistrict] = useState("");
  const [State, SetState] = useState("");
  const [pincode, Setpincode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const product = {
        name: Name,
        Malayalm: Malayalm,
        Tamil: Tamil,
        Scale: Scale,
        Price: Price,
      };
      const response = await axios.post(URL_PRO, product);
      console.log("Server Response:", response.data);
      SetName("");
      SetMalayalm("");
      SetTamil("");
      SetScale("");
      SetPrice("");
    } catch (error) {}
  }
  return (
    <>
      <h3>Add Product</h3>
      <h3>Add Customer</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => SetName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Create Date:
          <input
            type="text"
            value={createDate}
            onChange={(e) => setCreateDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            value={phone}
            onChange={(e) => Setphone(e.target.value)}
          />
        </label>
        <br />
        <label>
          Door:
          <input
            type="text"
            value={door}
            onChange={(e) => Setdoor(e.target.value)}
          />
        </label>
        <br />
        <label>
          Street:
          <input
            type="text"
            value={Street}
            onChange={(e) => SetStreet(e.target.value)}
          />
        </label>
        <br />
        <label>
          Area:
          <input
            type="text"
            value={Area}
            onChange={(e) => SetArea(e.target.value)}
          />
        </label>
        <br />
        <label>
          District:
          <input
            type="text"
            value={district}
            onChange={(e) => Setdistrict(e.target.value)}
          />
        </label>
        <br />
        <label>
          State:
          <input
            type="text"
            value={State}
            onChange={(e) => SetState(e.target.value)}
          />
        </label>
        <br />
        <label>
          Pincode:
          <input
            type="text"
            value={pincode}
            onChange={(e) => Setpincode(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create</button>
      </form>
    </>
  );
};
export default AddCustomer;

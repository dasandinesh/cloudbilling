import React, { useState } from "react";
import { URL_PRO } from "../url/url";
import api from "../../services/api";

const AddProduct = () => {
  const [Name, SetName] = useState("");
  const [Malayalm, SetMalayalm] = useState("");
  const [Tamil, SetTamil] = useState("");
  const [Scale, SetScale] = useState("");
  const [Price, SetPrice] = useState("");

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
      const response = await api.post(URL_PRO, product);
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
      <form onSubmit={handleSubmit}>
        <table>
          <tr>
            <th>product name</th>
            <td>
              <input
                type="text"
                value={Name}
                onChange={(e) => SetName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>malaylam name</th>
            <td>
              <input
                type="text"
                value={Malayalm}
                onChange={(e) => SetMalayalm(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>tamil name</th>
            <td>
              <input
                type="text"
                value={Tamil}
                onChange={(e) => SetTamil(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>Scale</th>
            <td>
              <input
                type="text"
                value={Scale}
                onChange={(e) => SetScale(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>Price</th>
            <td>
              <input
                type="text"
                value={Price}
                onChange={(e) => SetPrice(e.target.value)}
              />
            </td>
          </tr>
        </table>
        <button type="submit">Create</button>
      </form>
    </>
  );
};
export default AddProduct;

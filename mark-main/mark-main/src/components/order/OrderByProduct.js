import axios from "axios";
import { useState, useEffect } from "react";
import { URL_ORD_list_by_Product } from "../url/url";

const OrderByProduct = ({ closeModal }) => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const res = await axios.get(URL_ORD_list_by_Product);
        setProductList(res.data);
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    };
    fetchProductList();
  }, []); // Empty dependency array to run effect only once on component mount

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Order</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product, index) => (
              <tr key={index}>
                <td>{product.productName}</td>
                <td>{product.totalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderByProduct;

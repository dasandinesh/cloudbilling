import React from "react";
import "./../order/orderprintpre.css";
//import Orderprint from "./Orderprint";
// import { useNavigate } from "react-router-dom";

const OrderPrintPre = ({ selectedOrder, closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Order</h2>

        {selectedOrder && (
          <div>
            <div className="row">
              <div className="col-6">
                <table>
                  <tbody>
                    <tr>
                      <td>customer name</td>
                      <td> {selectedOrder.customer.name}</td>
                      <td>{selectedOrder.bill_details.date}</td>
                      <td>{selectedOrder.bill_details.bill_date}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3>product:</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Single Price</th>
                    <th>Scale</th>
                    <th>Total Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.single_price}</td>
                      <td>{product.scale}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <table>
              <tbody>
                <tr key="">
                  <th>{selectedOrder.bill_details.bill_date}</th>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPrintPre;

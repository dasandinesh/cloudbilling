import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./message.js";
import Popup from "./message.js";
import OrderPrintPre from "./orderPrintPre";
import OrderByProduct from "./OrderByProduct";

import {
  URL_ORD_update,
  URL_ORD_list,
  URL_ORD_add,
  URL_PRO_list,
  URL_getallcustomer,
} from "../url/url";
import "./order.css";
import { getValue } from "@testing-library/user-event/dist/utils/index.js";

const Orderform = () => {
  const test =
    "https://ap-south-1.aws.data.mongodb-api.com/app/data-muggu/endpoint/testing";

  //usesate for selectbox
  const [OrderList, SetOrderList] = useState([]);

  const [formEdited, setFormEdited] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectid, setSelectid] = useState("");
  //message
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // save selecred order object list by this
  const [selectedOrder, SetselectedOrder] = useState("");
  // Print prew modal  enable
  const [showOrderPrintPreModal, setshowOrderPrintPreModal] = useState(false);
  //
  const [ProductList, setProductList] = useState([]);

  const quantityInputRefs = useRef([]);
  // const singlepriceInputRefs = useRef([]);
  const ProductInputRefs = useRef([]);

  // State variable to hold the selected date
  const [selectedDate, setSelectedDate] = useState("");
  // State variable to hold the filtered order list
  const [filteredOrderList, setFilteredOrderList] = useState([]);

  // order by product modal  enable
  const [showOrderByProduct, setshowOrderByProduct] = useState(false);
  //customer
  const [customer, Setcustomer] = useState([]);

  const { register, control, handleSubmit, setValue, reset, getValues } =
    useForm({
      defaultValues: {
        customer: { name: "" },
        bill_details: {
          date: "",
          bill_date: "",
          total_quantity: "",
          transport: "",
          totalbagprice: "",
          totalWages: "",
          totalcommission: "",
          credit: "",
          cash: "",
          bill_amount: "",
        },
        products: [
          {
            name: "",
            quantity: "",
            single_price: "",
            scale: "",
            scaleno: "",
            bagprice: "",
            Wages: "",
            commission: "",
            price: "",
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = async (data) => {
    try {
      const requestData = {
        customer: data.customer,
        products: data.products,
        bill_details: data.bill_details,
      };

      let response;
      if (editMode) {
        // response = await axios.post(URL_ORD_add, requestData);
        console.log(requestData.id);
        // Function to send the POST request with ObjectId and form data
        async function sendDataToRealm(arg1, formData) {
          console.log(arg1);
          console.log(formData);
          try {
            // Construct the payload with ObjectId and form data
            const payload = {
              arg1: arg1,
              formData: formData,
            };

            // Make a POST request to the MongoDB Realm function endpoint
            const response = await axios.post(
              // `${URL_ORD_update}?arg1=${arg1}`,payload);
              URL_ORD_update,
              payload
            );

            // Log the response from the MongoDB Realm function
            console.log("Response:", response.data);
            setSuccessMessage("Data updated successfully!");
            setShowPopup(true);
          } catch (error) {
            console.error(
              "Error:",
              error.response ? error.response.data : error.message
            );
          }
        }

        // Call the function to send data to MongoDB Realm
        sendDataToRealm(selectid, requestData);

        console.log("edit mode");
      } else {
        response = await axios.post(URL_ORD_add, requestData);
        setShowPopup(true);
        // Refresh the page
        window.location.reload();
        setSuccessMessage("Data updated successfully!");
      }

      console.log("Server Response:", response.data);

      setEditMode(false);
    } catch (error) {
      console.error("Error while submitting data:", error);
    }
  };

  const onAddProduct = () => {
    append({
      name: "",
      quantity: "",
      single_price: "",
      scale: "",
      scaleno: "",
      bagprice: "",
      Wages: "",
      commission: "",
      price: "",
    });
  };
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setValue("bill_details.date", currentDate);
    setValue("bill_details.bill_date", currentDate);
    const inputField = document.querySelector('input[name="customer.name"]');
    if (inputField) {
      inputField.focus();
    }
  }, [setValue]);

  useEffect(() => {
    fetchProduct();
    fetchCustomer();
    const currentDate = new Date().toISOString().split("T")[0];
    setSelectedDate(currentDate);
    filterOrderListByDate(currentDate);
    get_order_list();
  }, []);

  const get_order_list = async () => {
    try {
      const res = await axios.get(URL_ORD_list);
      SetOrderList(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const editbill = async (id) => {
    try {
      const res = await axios.get(`${test}?arg1=${id}`);
      const { customer, products, bill_details } = res.data;
      reset({ customer, products, bill_details });

      setFormEdited(true);
      setEditMode(true);
      setSelectid(id);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const handleReset = () => {
    // Reset form edit mode
    setEditMode(false);

    setShowPopup(true);
    // Refresh the page
    window.location.reload();
    setSuccessMessage("Data updated successfully!");
  };
  const handlePrintPre = (order) => {
    SetselectedOrder(order);
    setshowOrderPrintPreModal(true);
  };
  const closeModal = () => {
    setshowOrderPrintPreModal(false);
    setshowOrderByProduct(false);
    setSelectid(null);
  };

  //get product

  const fetchProduct = async () => {
    try {
      const res = await axios.get(URL_PRO_list);
      setProductList(res.data);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(URL_getallcustomer);
      Setcustomer(res.data);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };
  //  price auto fill
  const handleProductSelection = (productName, index) => {
    // Find the selected product from the product list
    const selectedProduct = ProductList.find(
      (product) => product.name === productName
    );
    // Update the single price field with the price of the selected product
    if (selectedProduct) {
      console.log(selectedProduct.Price);
      setValue(`products.${index}.single_price`, selectedProduct.Price);
      setValue(`products.${index}.scale`, selectedProduct.Scale);

      // Focus on the next input field
      const inputs = Array.from(document.forms[0].elements);
      const currentIndex = inputs.findIndex(
        (input) => input.name === `products.${index}.name`
      );
      let nextIndex = currentIndex + 1;

      // Skip any fields you want to ignore
      const skipIndices = [currentIndex]; // Skip the current input field

      while (skipIndices.includes(nextIndex)) {
        nextIndex++;
      }

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
        inputs[nextIndex].select(); // Select text in the next input field
      }
    } else {
      // Handle case where selected product is not found
      console.error(`Product with name not found.`);
      // Optionally, you can provide a default value or perform other actions
    }
  };

  const handleKeyDown = (event, index, onAddProduct) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputs = Array.from(event.target.form.elements).filter(
        (input) => input.tagName === "INPUT"
      );

      if (inputs.length === 0) return;

      const currentIndex = inputs.indexOf(event.target);

      if (inputs[currentIndex].name === `products.${index}.commission`) {
        const nameInput = event.target.form.elements[`products.${index}.name`];
        const nameValue = nameInput.value;

        if (!nameValue) {
          remove(index);
          const billAmountInput = document.querySelector(
            'input[name="bill_details.transport"]'
          );
          if (billAmountInput) billAmountInput.focus();
          return;
        }

        let nextIndex = currentIndex;
        let foundNextRow = false;
        while (nextIndex < inputs.length) {
          nextIndex++;
          if (
            inputs[nextIndex] &&
            inputs[nextIndex].name &&
            inputs[nextIndex].name.startsWith(`products.${index + 1}`)
          ) {
            foundNextRow = true;
            break;
          }
        }

        if (foundNextRow && inputs[nextIndex]) {
          inputs[nextIndex].focus();
          inputs[nextIndex].select();
        } else if (nameValue) {
          onAddProduct();
        }
      } else {
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputs.length) {
          inputs[nextIndex].focus();
          inputs[nextIndex].select();
        }
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const currentInput = event.target;
      const inputs = Array.from(event.target.form.elements).filter(
        (input) => input.tagName === "INPUT"
      );
      const currentIndex = inputs.indexOf(currentInput);
      const nextRowInputName = inputs[currentIndex].name.replace(
        `products.${index}`,
        `products.${index + 1}`
      );
      const nextRowInput = inputs.find(
        (input) => input.name === nextRowInputName
      );

      if (nextRowInput) {
        nextRowInput.focus();
        nextRowInput.select();
      }
    }
  };

  // Function to calculate total bill amount
  const calculateTotalBillAmount = () => {
    let totalAmount = 0;
    fields.forEach((product, index) => {
      const productPrice = parseFloat(getValues(`products.${index}.price`));
      if (!isNaN(productPrice)) {
        totalAmount += productPrice;
      }
    });
    setValue("bill_details.bill_amount", totalAmount.toFixed(2));
  };
  // Function to filter the order list based on the selected date

  const filterOrderListByDate = (date) => {
    const filteredOrders = OrderList.filter(
      (order) => order.bill_details.date === date
    );
    setFilteredOrderList(filteredOrders);
  };

  // Handler for date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    filterOrderListByDate(date);
  };

  //view modal order by product
  const handleOrderbyProduct = () => {
    setshowOrderByProduct(true);
  };
  // auto ill with name
  const handleCustomerChange = (e) => {
    const selectedOrder = filteredOrderList.find(
      (order) => order.customer.name === e.target.value.trim()
    );

    if (selectedOrder) {
      try {
        const { customer, products, bill_details, _id: id } = selectedOrder;
        reset({ customer, products, bill_details });
        setFormEdited(true);
        setEditMode(true);
        setSelectid(id);
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    }
  };

  return (
    <div className="main row">
      {/* Render the Popup component if showPopup is true */}
      {showPopup && (
        <Popup message={successMessage} onClose={() => setShowPopup(false)} />
      )}
      <div className="col-sm-9">
        <div>
          <center>
            <h4>order</h4>
          </center>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Customer Information */}
          <div className="row">
            <div className="col-6">
              <div>
                <p>Customer Name:</p>
                <input
                  type="text"
                  {...register("customer.name")}
                  placeholder="Customer Name"
                  required
                  list="cusSuggestion"
                  onChange={handleCustomerChange}
                />
                <datalist id="cusSuggestion">
                  {customer.map((customer, index) => (
                    <option key={index} value={customer.name} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="col-6">
              <div style={{ float: "left", marginRight: "10px" }}>
                <p>Today Date:</p>
                <input
                  type="date"
                  {...register("bill_details.date")}
                  placeholder="Date"
                  readOnly
                  className="date"
                />
              </div>
              <div style={{ float: "left" }}>
                <p>Bill Date:</p>
                <input
                  type="date"
                  {...register("bill_details.bill_date")}
                  placeholder="Bill Date"
                  className="date"
                  required
                />
              </div>
              <div style={{ clear: "both" }}></div> {/* Clear the float */}
            </div>
          </div>
          <br />
          {/* Bill Details */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Single Price</th>
                  <th>Scale</th>
                  <th>scaleno</th>
                  <th>bagprice</th>
                  <th>Wages</th>
                  <th>commission</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((product, index) => (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="text"
                        {...register(`products.${index}.name`)}
                        placeholder="Product Name"
                        className="mediumInput"
                        required
                        list="productSuggestions"
                        onChange={(e) =>
                          handleProductSelection(e.target.value, index)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            // Focus on the next input field
                            const inputs = Array.from(e.target.form.elements);
                            const currentIndex = inputs.indexOf(e.target);
                            let nextIndex = currentIndex + 1;

                            // Skip any fields you want to ignore
                            const skipIndices = [currentIndex]; // Skip the current input field

                            while (skipIndices.includes(nextIndex)) {
                              nextIndex++;
                            }

                            if (nextIndex < inputs.length) {
                              inputs[nextIndex].focus();
                            }
                          }
                        }}
                      />
                      <datalist id="productSuggestions">
                        {ProductList.map((product, index) => (
                          <option key={index} value={product.name} />
                        ))}
                      </datalist>
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`products.${index}.quantity`)}
                        placeholder="Quantity"
                        className="smallInput"
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        required
                        onChange={(e) => {
                          const quantity = parseFloat(e.target.value);
                          const singlePrice = parseFloat(
                            e.target.form[`products.${index}.single_price`]
                              .value
                          ); // Access single_price directly from the form

                          const totalPrice =
                            isNaN(quantity) || isNaN(singlePrice)
                              ? 0
                              : quantity * singlePrice;
                          setValue(
                            `products.${index}.price`,
                            totalPrice.toFixed(2)
                          ); // Round to 2 decimal places
                          calculateTotalBillAmount();
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`products.${index}.single_price`)}
                        placeholder="Single Price"
                        className="smallInput"
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        // ref={(el) => (singlepriceInputRefs.current[index] = el)}
                        onChange={(e) => {
                          const singlePrice = parseFloat();
                          const quantity = parseFloat(
                            e.target.form[`products.${index}.quantity`].value
                          ); // Access single_price directly from the form

                          const totalPrice =
                            isNaN(quantity) || isNaN(singlePrice)
                              ? 0
                              : quantity * singlePrice;
                          setValue(
                            `products.${index}.price`,
                            totalPrice.toFixed(2)
                          ); // Round to 2 decimal places
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.scale`)}
                        placeholder="Scale"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        {...register(`products.${index}.scaleno`)}
                        placeholder="scaleno"
                        className="smallInput"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.bagprice`)}
                        placeholder="bagprice"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.Wages`)}
                        placeholder="Wages"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.commission`)}
                        placeholder="commission"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`products.${index}.price`)}
                        placeholder="Price"
                        className="smallInput"
                        readOnly
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => remove(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <center>
            <button className="buttonb" type="button" onClick={onAddProduct}>
              Product Add
            </button>
          </center>

          <div className="row">
            <div className="col-md-3 col-6">
              <div>
                <p>Transport:</p>
                <input
                  className="mobilevies"
                  type="text"
                  {...register("bill_details.transport")}
                  placeholder="Transport"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
              <div>
                <p>Total Quantity:</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.total_quantity")}
                  placeholder="Total Quantity"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div>
                <p>totalbagprice:</p>
                <input
                  className="mobilevies"
                  type="text"
                  {...register("bill_details.totalbagprice")}
                  placeholder="totalbagprice"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
              <div>
                <p>totalWages:</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.totalWages")}
                  placeholder="totalWages"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
              <div>
                <p>totalcommission:</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.totalcommission")}
                  placeholder="totalcommission"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div>
                <p>Credit</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.credit")}
                  placeholder="Credit"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
              <div>
                <p>Cash</p>{" "}
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.cash")}
                  placeholder="Cash"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                />
              </div>
            </div>
            <div className="col-md-3 col-12">
              <div>
                <p>Bill Amount:</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.bill_amount")}
                  placeholder="Bill Amount"
                  onKeyDown={(e) =>
                    handleKeyDown(e, onAddProduct, fields, remove)
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
          <center>
            <button className="buttonb" type="submit">
              {editMode ? "Update Order" : "Submit"}
            </button>
            <button className="buttonb" type="button" onClick={handleReset}>
              ADD new
            </button>
            <a
              href="#"
              className="buttonb"
              onClick={() => handleOrderbyProduct()}
            >
              order by product
            </a>
            <a href="#" className="buttonb">
              prodct catagry
            </a>
          </center>
        </form>
        <hr />
      </div>
      <div className="col-sm-3">
        <div style={{ height: "600px", overflow: "scroll", display: "block" }}>
          <input
            type="date"
            className="date"
            name="date-filter"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <h3>Order List</h3>
          <table>
            <thead>
              <tr>
                <th>
                  <input style={{ width: "30px" }} type="checkbox" />
                </th>
                <th>S.No</th>
                <th>Name</th>
                <th>View</th>
                <th>edit</th>
                <th>det</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrderList.map((customer, index) => (
                <tr key={index}>
                  <td>
                    <input style={{ width: "30px" }} type="checkbox" />
                  </td>
                  <td>{index + 1}</td>
                  <td>{customer.customer.name}</td>
                  <td style={{ cursor: "pointer" }}>
                    <a onClick={() => handlePrintPre(customer)}>
                      <FaEye />
                    </a>
                  </td>
                  <td>
                    <button onClick={() => editbill(customer._id)}>
                      <FaRegEdit />
                    </button>
                  </td>
                  <td>
                    <a>
                      <MdDeleteOutline />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showOrderPrintPreModal && (
        <OrderPrintPre selectedOrder={selectedOrder} closeModal={closeModal} />
      )}
      {showOrderByProduct && <OrderByProduct closeModal={closeModal} />}
    </div>
  );
};
export default Orderform;

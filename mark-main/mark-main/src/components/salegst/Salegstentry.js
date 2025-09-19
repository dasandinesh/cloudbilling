import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import "./../sale/order.css";
import OrderByProduct from "../sale/OrderByProduct.js";
import OrderPrintPre from "../sale/orderPrintPre.js";
import Popup from "../sale/message.js";

import {
  URL_PRO_list,
  URL_getallcustomer,
  get_order_by_date,
  test,
  URL_Sale_Bill,
  URL_get_sale_by_date,
  URL_purchaseentry,
} from "../url/url";
const SaleGstEntry = () => {
  //message data
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // State variable to hold the filtered order list
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  // Current date
  const [selectedDate, setSelectedDate] = useState("");
  // Second date
  const [selectedSecDate, setSelectedSecDate] = useState("");

  //customer
  const [customer, Setcustomer] = useState([]);
  const [selectedcustomer, Setselectedcustomer] = useState([]);
  const [ProductList, setProductList] = useState([]);

  //save or update
  const [editMode, setEditMode] = useState(false);
  const [selectid, setSelectid] = useState("");

  // save selecred order object list by this
  const [selectedOrder, SetselectedOrder] = useState("");

  // Print prew modal  enable
  const [showOrderPrintPreModal, setshowOrderPrintPreModal] = useState(false);

  // order by product modal  enable
  const [showOrderByProduct, setshowOrderByProduct] = useState(false);

  const [formEdited, setFormEdited] = useState(false);
  //sale bill by date
  const [SalebillData, SetSalebillData] = useState([]);
  const [selectedsaleDate, SetselectedsaleDate] = useState("");
  const [selectedsecsaleDate, SetselectedsecsaleDate] = useState("");

  const { register, control, handleSubmit, setValue, reset, getValues, watch } =
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
          gstgrouppycatagry: {
            0: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
            5: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
            12: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
            18: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
            28: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
          },
        },
        products: [
          {
            name: "",
            serial_no: "",
            description: "",
            hsn: "",
            quantity: "",
            single_price: "",
            gstpre: "",
            crossprice: "",
            crossprice_total: "",
            scale: "",
            scaleno: "",
            Cgst: "",
            sgst: "",
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

  //add product fuction
  const onAddProduct = () => {
    append({
      name: "",
      product_serial_no: "",
      product_description: "",
      product_hsn: "",
      quantity: "",
      single_price: "",
      tgstpre: "",
      crossprice: "",
      crossprice_total: "",
      scale: "",
      scaleno: "",
      Cgst: "",
      sgst: "",
      bagprice: "",
      Wages: "",
      commission: "",
      price: "",
    });
  };

  const onSubmit = async (data) => {
    try {
      const requestData = {
        customer: data.customer,
        products: data.products,
        bill_details: data.bill_details,
      };

      let response;
      if (editMode) {
        response = await axios.post(URL_purchaseentry, requestData);
        setShowPopup(true);
        // Refresh the page
        window.location.reload();
        setSuccessMessage("Data updated successfully!");
      } else {
        response = await axios.post(URL_purchaseentry, requestData);
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

  useEffect(() => {
    fetchProduct();
    fetchCustomer();
    const currentDate = new Date().toISOString().split("T")[0];
    setSelectedDate(currentDate);
    SetselectedsaleDate(currentDate);
    setValue("bill_details.date", currentDate);
    setValue("bill_details.bill_date", currentDate);
    const inputField = document.querySelector('input[name="customer.name"]');
    if (inputField) {
      inputField.focus();
    }
  }, []);

  useEffect(() => {
    get_sale_list_date(selectedsaleDate, selectedsecsaleDate);
  }, [selectedsaleDate, selectedsecsaleDate]);

  useEffect(() => {
    const get_order_list_date = async (selectedDate, selectedSecDate) => {
      try {
        const response = await axios.get(get_order_by_date, {
          params: {
            arg1: selectedDate,
            arg2: selectedSecDate,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data) {
          setFilteredOrderList(response.data);
          console.log(response.data);
        } else {
          console.log("ok");
        }
      } catch (error) {
        console.error("Error fetching order list:", error);
        setFilteredOrderList([]);
      }
    };

    get_order_list_date(selectedDate, selectedSecDate);
  }, [selectedDate, selectedSecDate, get_order_by_date]);

  const get_sale_list_date = async (selectedsaleDate, selectedsaleSecDate) => {
    try {
      const response = await axios.get(URL_get_sale_by_date, {
        params: {
          arg1: selectedsaleDate,
          arg2: selectedsaleSecDate,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        SetSalebillData(response.data);
        console.log(response.data);
      } else {
        console.log("ok");
      }
    } catch (error) {
      console.error("Error fetching order list:", error);
      SetSalebillData([]);
    }
  };

  // Handler for date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  const handleSecDateChange = (e) => {
    const date = e.target.value;
    setSelectedSecDate(date);
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
      setValue(`products.${index}.gstpre`, selectedProduct.gstpre);

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

  //enter key
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
    } else {
      console.warn("No order found for the selected customer name");
    }
    console.log(e.target.value.trim());
    const selectedcustomervar = customer.find(
      (customers) => customers.name === e.target.value.trim()
    );

    Setselectedcustomer(selectedcustomervar);
    console.log("customer", selectedcustomervar);
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

  const products = watch("products");

  useEffect(() => {
    const gstGroups = {
      0: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
      5: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
      12: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
      18: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
      28: { taxableAmount: 0, cgst: 0, sgst: 0, totalAmount: 0 },
    };

    let totalQuantity = 0;

    products.forEach((product) => {
      const gstRate = parseFloat(product.gstpre) || 0;
      const quantity = parseFloat(product.quantity) || 0;
      const singlePrice = parseFloat(product.single_price) || 0;
      const taxableAmount = quantity * singlePrice;
      const cgst = ((gstRate / 2) * taxableAmount) / 100;
      const sgst = ((gstRate / 2) * taxableAmount) / 100;
      const totalAmount = taxableAmount + cgst + sgst;
      totalQuantity = totalQuantity + quantity;

      gstGroups[gstRate].taxableAmount += taxableAmount;
      gstGroups[gstRate].cgst += cgst;
      gstGroups[gstRate].sgst += sgst;
      gstGroups[gstRate].totalAmount += totalAmount;
    });

    setValue("bill_details.gstgrouppycatagry", gstGroups);
    setValue("bill_details.total_quantity", totalQuantity);
  }, [products, setValue]);

  return (
    <div className="main row">
      {/* Render the Popup component if showPopup is true */}
      {showPopup && (
        <Popup message={successMessage} onClose={() => setShowPopup(false)} />
      )}

      <div className="col-sm-9">
        <center>
          <h3>GST Sale Entry</h3>
        </center>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Customer Information */}
          <div className="row">
            <div className="col-4">
              <div className="customer-container">
                <div className="customer-select">
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
                  <div>
                    <br />
                    <h6>oldBalance:</h6>
                    {selectedcustomer && <p>{selectedcustomer.oldBalance}</p>}
                  </div>
                </div>
                <div className="customer-details">
                  <h5>customer:</h5>
                  {selectedcustomer && (
                    <address className="bill-to">
                      <p>{selectedcustomer.name},</p>
                      <p>
                        {selectedcustomer.door}, {selectedcustomer.street},{" "}
                        {selectedcustomer.area},
                      </p>
                      <p>
                        {selectedcustomer.district},{selectedcustomer.state}.
                      </p>
                      <p>
                        <label>Pin code: </label>
                        {selectedcustomer.pincode}
                      </p>
                      <p>
                        <label>Phone: </label>
                        {selectedcustomer.phone}
                      </p>
                    </address>
                  )}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div>
                <p>
                  <h5>BILL No:</h5>
                  <input type="text" />
                </p>
              </div>
            </div>
            <div className="col-3">
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
                <p>BILL Date:</p>
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
          {/* Bill Details */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>serial no</th>
                  <th>description</th>
                  <th>HSN</th>
                  <th>Quantity</th>
                  <th>Single Price</th>
                  <th>gstpre</th>
                  <th>crossprice</th>
                  <th>crossprice_total</th>
                  <th>Scale</th>
                  <th>Cgst</th>
                  <th>sgst</th>
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
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.serial`)}
                        placeholder="serial"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.description`)}
                        placeholder="description"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.hsn`)}
                        placeholder="hsn"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`products.${index}.quantity`)}
                        placeholder="Quantity"
                        className="smallInput"
                        required
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                        onChange={(e) => {
                          const quantity = parseFloat(e.target.value) || 0;
                          const form = e.target.form;
                          const singlePrice =
                            parseFloat(
                              form[`products.${index}.single_price`].value
                            ) || 0; // Access single_price directly from the form
                          const gstPercentage =
                            parseFloat(
                              form[`products.${index}.gstpre`].value
                            ) || 0; // Access GST percentage from the form

                          const totalPrice =
                            isNaN(quantity) || isNaN(singlePrice)
                              ? 0
                              : quantity * singlePrice;
                          const gstAmount = (totalPrice * gstPercentage) / 100;
                          const singleGstAmount =
                            (singlePrice * gstPercentage) / 100;
                          const cgstTotal = gstAmount / 2;
                          const sgstTotal = gstAmount / 2;

                          setValue(
                            `products.${index}.price`,
                            totalPrice.toFixed(2)
                          ); // Total price excluding GST
                          setValue(
                            `products.${index}.crossprice`,
                            singleGstAmount.toFixed(2)
                          ); // GST amount per single item
                          setValue(
                            `products.${index}.cgst`,
                            cgstTotal.toFixed(2)
                          ); // CGST amount
                          setValue(
                            `products.${index}.Sgst`,
                            sgstTotal.toFixed(2)
                          ); // SGST amount
                          setValue(
                            `products.${index}.crossprice_total`,
                            gstAmount.toFixed(2)
                          ); // Total GST amount

                          calculateTotalBillAmount(); // Update the total bill amount
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`products.${index}.single_price`)}
                        placeholder="Single Price"
                        className="smallInput"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                        onChange={(e) => {
                          const singlePrice = parseFloat(e.target.value);
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
                          calculateTotalBillAmount();
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.gstpre`)}
                        placeholder="gstpre"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.crossprice`)}
                        placeholder="crossprice"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        type="text"
                        className="smallInput"
                        {...register(`products.${index}.crossprice_total`)}
                        placeholder="crossprice_total"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
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
                        {...register(`products.${index}.cgst`)}
                        placeholder="cgst"
                        className="smallInput"
                        onKeyDown={(e) =>
                          handleKeyDown(e, index, onAddProduct, fields, remove)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        {...register(`products.${index}.Sgst`)}
                        placeholder="Sgst"
                        className="smallInput"
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
                        &#x2715;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <center>
            <button
              className="buttonb"
              type="button"
              onClick={() =>
                append({
                  name: "",
                  quantity: "",
                  single_price: "",
                  scale: "",
                  price: "",
                })
              }
            >
              Product Add
            </button>
          </center>
          <div className="row">
            <div className="col-md-2">
              <div>
                <p>Transport:</p>
                <input
                  className="mobilevies"
                  type="text"
                  {...register("bill_details.transport")}
                  placeholder="Transport"
                />
              </div>
              <div>
                <p>Total Quantity:</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.total_quantity")}
                  placeholder="Total Quantity"
                />
              </div>
            </div>
            <div className="col-md-4">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Taxable Amount</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    getValues("bill_details.gstgrouppycatagry")
                  ).map(([gstRate, summary], index) => (
                    <tr key={index}>
                      <td>{gstRate}%</td>
                      <td>{summary.taxableAmount.toFixed(2)}</td>
                      <td>{summary.cgst.toFixed(2)}</td>
                      <td>{summary.sgst.toFixed(2)}</td>
                      <td>{summary.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-3">
              {" "}
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
            <div className="col-md-3">
              <div>
                <p>Cash</p>{" "}
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.cash")}
                  placeholder="Cash"
                />
              </div>
              <div>
                <p>Credit</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.credit")}
                  placeholder="Credit"
                />
              </div>

              <div>
                <p>Bill Amount:</p>
                <input
                  className="mobilevies"
                  type="number"
                  {...register("bill_details.bill_amount")}
                  placeholder="Bill Amount"
                  readOnly
                />
              </div>
            </div>
          </div>
          <center>
            <button className="buttonb" type="submit">
              {editMode ? "Update Order" : "Save"}
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
      </div>

      <div className="col-sm-3">
        <div
          style={{
            height: "350px",
            overflow: "scroll",
            display: "block",
          }}
        >
          <h6>Order List</h6>
          <div>
            <div style={{ float: "left", marginRight: "10px" }}>
              <input
                type="date"
                className="date"
                name="date-filter"
                onChange={handleDateChange}
                value={selectedDate}
              />
            </div>
            <div style={{ float: "left", marginRight: "10px" }}>
              <input
                type="date"
                className="date"
                name="date-filter"
                value={selectedSecDate}
                onChange={handleSecDateChange}
              />
            </div>
          </div>
          {Array.isArray(filteredOrderList) && filteredOrderList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Delete</th>
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
          ) : (
            <p>No orders found</p>
          )}
        </div>
        <div
          style={{
            height: "350px",
            overflow: "scroll",
            display: "block",
          }}
        >
          <h6>Bill List</h6>
          <div>
            <div style={{ float: "left", marginRight: "10px" }}>
              <input
                type="date"
                className="date"
                name="date-filter"
                value={selectedsaleDate}
                onChange={(e) => {
                  SetselectedsaleDate(e.target.value);
                }}
              />
            </div>
            <div style={{ float: "left", marginRight: "10px" }}>
              <input
                type="date"
                className="date"
                name="date-filter"
                value={selectedsecsaleDate}
                onChange={(e) => {
                  SetselectedsecsaleDate(e.target.value);
                }}
              />
            </div>
          </div>
          {Array.isArray(SalebillData) && SalebillData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {SalebillData.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <input style={{ width: "30px" }} type="checkbox" />
                    </td>
                    <td>{index + 1}</td>
                    <td>{customer.customer.name}</td>
                    <td style={{ cursor: "pointer" }}>
                      <button
                        onClick={() => handlePrintPre(customer)}
                        style={{
                          background: "none",
                          color: "inherit",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <FaEye />
                      </button>
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
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
      {showOrderPrintPreModal && (
        <OrderPrintPre selectedOrder={selectedOrder} closeModal={closeModal} />
      )}
      {showOrderByProduct && <OrderByProduct closeModal={closeModal} />}
    </div>
  );
};
export default SaleGstEntry;

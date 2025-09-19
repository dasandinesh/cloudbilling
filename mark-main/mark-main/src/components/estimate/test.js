import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm, useFieldArray, useWatch} from "react-hook-form";
import axios from "axios";
import { URL_EST_add, URL_EST_list, URL_EST_update, URL_EST_Delete,URL_EST_select,URL_PRO_list } from "../url/url";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import EstimatePrintPre from "../order/orderPrintPre";
import { URL_getallcustomer } from "../url/url";
import "./mobilsaleentry.css";
import "./order.css"

const EstimateEntry = () => {
    const [editMode, setEditMode] = useState(false);

    const [productList, setProductList] = useState([]);
    const [estimateList, setestimateList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const productNameRef = useRef(null);
    const quantityRef = useRef(null);
    const singlePriceRef = useRef(null);
    const commentRef = useRef(null);
    const [selectid, setSelectid] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const [formMode, setFormMode] = useState('NEW'); // NEW | CONVERT | EDIT
    const [product, setProduct] = useState({
        name: "",
        comment: "",
        quantity: "",
        single_price: "",
        scale: "",
        tgstpre:"",
        crossprice:"",
        crossprice_total:"",
        scaleno: "",
        cgst:"",
        sgst:"",
        single_bag_amount: "",
        bagprice: "",
        single_wages_amount: "",
        Wages: "",
        single_commission_amount: "",
        commission: "",
        price: "",
    });

    const { register, control, handleSubmit, setValue, reset, getValues, watch } = useForm({
        defaultValues: {
            customer: { name: "" },
            bill_details: {
                order_sno:"",
                date: new Date().toISOString().split("T")[0],
                bill_date: new Date().toISOString().split("T")[0],
                total_quantity: "",
                transport: "",
                totalbagprice: "",
                totalWages: "",
                totalcommission: "",
                credit: "",
                cash: "",
                old_balance: "",
                new_balance: "",
                subtotal: "",
                bill_amount: "",
            },
            products: [
                // { name: "", comment: "", quantity: "", single_price: "", scale: "", scaleno: "", single_bag_amount: "", bagprice: "", single_wages_amount: "", Wages: "", single_commission_amount: "", commission: "", price: "" }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products",
    });

        const [currentestimateIndex, setCurrentestimateIndex] = useState(-1); // -1 means new entry
    const [activeList, setActiveList] = useState("estimates"); // 'estimates' or 'orders'

    const [customerList, setCustomerList] = useState([]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(URL_getallcustomer);
                setCustomerList(response.data);
            } catch (error) {
                console.error("Failed to fetch customer list:", error);
            }
        };
        fetchCustomer();
    }, []);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [oldBalance, setOldBalance] = useState(0);
    const [newBalance, setNewBalance] = useState(0);

    useEffect(() => {
        const customer = customerList.find((customer) => customer.name === getValues("customer.name"));
        setSelectedCustomer(customer);
        setOldBalance(customer?.oldBalance || 0);
        setValue("bill_details.old_balance", customer?.oldBalance || 0);
        console.log(customer);
        
        // Fetch customer's old balance when customer is selected
   
    },[getValues("customer.name")]);



    // Watch for changes in bill amount, cash, and credit to auto-calculate new balance
    const watchedFields = watch(["bill_details.bill_amount", "bill_details.cash", "bill_details.credit"]);
    
    // Auto-calculate new balance whenever relevant fields change
    useEffect(() => {
        const calculateNewBalance = () => {
            const billAmount = parseFloat(getValues("bill_details.bill_amount")) || 0;
            const cash = parseFloat(getValues("bill_details.cash")) || 0;
            const credit = parseFloat(getValues("bill_details.credit")) || 0;
            
            // New Balance = Old Balance + Bill Amount - Cash - Credit
            const calculatedNewBalance = oldBalance + billAmount - cash - credit;
            
            setNewBalance(calculatedNewBalance);
            setValue("bill_details.new_balance", calculatedNewBalance);
        };
        
        calculateNewBalance();
    }, [watchedFields, oldBalance, setValue, getValues]);

    // Fetch estimates list
    const fetchestimateList = useCallback(async (date) => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/estimates/all?date=${date || selectedDate}`, {
                withCredentials: true // Include cookies for authentication
            });
            setestimateList(res.data);
        } catch (error) {
            console.error("Error fetching estimate list:", error);
        }
    }, [selectedDate]);

    // Fetch order list
    const fetchOrderList = useCallback(async (date) => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/estimates/all?date=${date || selectedDate}`, {
                withCredentials: true // Include cookies for authentication
            });
            setOrderList(res.data);
        } catch (error) {
            console.error("Error fetching order list:", error);
        }
    }, [selectedDate]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(URL_PRO_list);
                setProductList(response.data);
            } catch (error) {
                console.error("Failed to fetch product list:", error);
            }
        };

        fetchProduct();
        fetchestimateList(selectedDate);
        fetchOrderList(selectedDate);
    }, [fetchestimateList, fetchOrderList, selectedDate]);

    const onSubmit = async (data) => {
        try {
          const requestData = {
            customer: data.customer,
            products: data.products,
            bill_details: data.bill_details,
          };
    
          let response;
          if (editMode || formMode === 'EDIT') {
            // response = await axios.post(URL_estimate_add, requestData);
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
                const response = await axios.put(
                  // `${URL_estimate_update}?arg1=${arg1}`,payload);
                  URL_EST_update,
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
            response = await axios.post(URL_EST_add, requestData);
            setShowPopup(true);
            // Refresh the page
            window.location.reload();
            setSuccessMessage("Data updated successfully!");
          }
    
          console.log("Server Response:", response.data);
    
          setEditMode(false);
          setFormMode('NEW');
        } catch (error) {
          console.error("Error while submitting data:", error);
        }
      };

       
      useEffect(() => {
        fetchOrderList();
      }, []);
    const handleAddProduct = () => {
        if (product.name && product.quantity && product.single_price) {
            append({
                name: product.name,
                comment: product.comment,
                quantity: product.quantity,
                single_price: product.single_price,
                scale: product.scale,
                tgstpre: product.gstpre || "",
                // Calculate base prices and GST
                crossprice: (parseFloat(product.single_price) * ( (parseFloat(product.gstpre) / 100))).toFixed(2) || "",
                crossprice_total: (parseFloat(product.single_price) * parseFloat(product.quantity) * ( (parseFloat(product.gstpre) / 100))).toFixed(2) || "",
                cgst: (parseFloat(product.single_price) * parseFloat(product.quantity) * (parseFloat(product.gstpre) / 200)).toFixed(2) || "", // GST/2 for CGST (half of total GST)
                sgst: (parseFloat(product.single_price) * parseFloat(product.quantity) * (parseFloat(product.gstpre) / 200)).toFixed(2) || "", // GST/2 for SGST (half of total GST)
                scaleno: product.scaleno || "",
                single_bag_amount: product.bagprice,
                bagprice: product.bagprice * (parseFloat(product.quantity)),
                single_wages_amount: product.Wages,
                Wages: product.Wages * (parseFloat(product.quantity)),
                single_commission_amount: product.commission,
                commission: product.commission * (parseFloat(product.quantity)),
                price: (parseFloat(product.quantity) * parseFloat(product.single_price)).toFixed(2),
            });
            // Clear the input fields
            setProduct({
                name: "",
                comment: "",
                quantity: "",
                single_price: "",
                scale: "",
                tgstpre: "",
                crossprice: "",
                crossprice_total: "",
                cgst: "",
                sgst: "",
                scaleno: "",
                single_bag_amount: "",
                bagprice: "",
                single_wages_amount: "",
                Wages: "",
                single_commission_amount: "",
                commission: "",
                price: "",
            });
            setTimeout(() => {
                if (productNameRef.current) {
                    productNameRef.current.focus();
                }
            }, 0);
        }
    };


    // Auto-calculate price for existing products when quantity or price changes
    const products = useWatch({ control, name: "products" });
    useEffect(() => {
        if (!products) return;
        const totalBagPrice = products.reduce((sum, prod) => sum + (parseFloat(prod.bagprice) || 0), 0);
        const totalWages = products.reduce((sum, prod) => sum + (parseFloat(prod.Wages) || 0), 0);
        const totalCommission = products.reduce((sum, prod) => sum + (parseFloat(prod.commission) || 0), 0);
        const totalQuantity = products.reduce((sum, prod) => sum + (parseFloat(prod.quantity) || 0), 0);
        const subtotal = products.reduce((sum, prod) => sum + (parseFloat(prod.price) || 0), 0);

        setValue("bill_details.totalbagprice", totalBagPrice.toFixed(2));
        setValue("bill_details.totalWages", totalWages.toFixed(2));
        setValue("bill_details.totalcommission", totalCommission.toFixed(2));
        setValue("bill_details.total_quantity", totalQuantity.toFixed(2));
        setValue("bill_details.subtotal", subtotal.toFixed(2));
    }, [products, setValue]);

    useEffect(() => {
    // Get all relevant values as numbers (default to 0 if not set)
    const subtotal = parseFloat(getValues("bill_details.subtotal")) || 0;
    const totalWages = parseFloat(getValues("bill_details.totalWages")) || 0;
    const totalcommission = parseFloat(getValues("bill_details.totalcommission")) || 0;
    const totalbagprice = parseFloat(getValues("bill_details.totalbagprice")) || 0;
    const transport = parseFloat(getValues("bill_details.transport")) || 0;

    // Sum up all relevant fields
    const billAmount = subtotal + totalWages + totalcommission + totalbagprice + transport;

    // Set the calculated bill amount
    setValue("bill_details.bill_amount", billAmount.toFixed(2));
}, [
    watch("bill_details.subtotal"),
    watch("bill_details.totalWages"),
    watch("bill_details.totalcommission"),
    watch("bill_details.totalbagprice"),
    watch("bill_details.transport"),
    setValue,
    getValues
]);

    // Handler for date change for estimate list
        const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        if (activeList === 'estimates') {
            fetchestimateList(newDate);
        } else {
            fetchOrderList(newDate);
        }
    };

    const handleestimateDateChange = (e) => {
        setSelectedDate(e.target.value);
        // fetch estimate list for new date
        const fetchestimateList = async (date) => {
            try {
                const res = await axios.get(`${URL_EST_list}?date=${date}`);
                setestimateList(res.data.estimates);
            } catch (error) {
                console.error("Error fetching estimate list:", error);
            }
        };
        fetchestimateList(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddProduct();
        }
    }

        const handleSelectOrder = (order) => {
        setEditMode(false);
        setFormMode('CONVERT');

        const formData = {
            customer: { name: order.customer?.name || "" },
            bill_details: {
                ...order.bill_details,
                date: new Date().toISOString().split("T")[0],
                bill_date: new Date().toISOString().split("T")[0],
            },
            products: order.products || [],
        };

        reset(formData);
    };

    const handleEditestimate = (estimate) => {
        setEditMode(true);
        setFormMode('EDIT');
        setSelectid(estimate._id); // Store the estimate's ID for updating
        const index = estimateList.findIndex(o => o._id === estimate._id);
        setCurrentestimateIndex(index);

        // Prepare the data for the form
        const formData = {
            customer: { name: estimate.customer?.name || "" },
            bill_details: {
                ...estimate.bill_details,
                date: estimate.bill_details?.date || new Date().toISOString().split("T")[0],
                bill_date: estimate.bill_details?.bill_date || new Date().toISOString().split("T")[0],
                total_quantity: estimate.bill_details?.total_quantity || "",
                transport: estimate.bill_details?.transport || "",
                totalbagprice: estimate.bill_details?.totalbagprice || "",
                totalWages: estimate.bill_details?.totalWages || "",
                totalcommission: estimate.bill_details?.totalcommission || "",
                credit: estimate.bill_details?.credit || "",
                cash: estimate.bill_details?.cash || "",
                subtotal: estimate.bill_details?.subtotal || "",
                bill_amount: estimate.bill_details?.bill_amount || "",
            },
            products: estimate.products || [],
        };

        reset(formData); // Populate the form with the estimate's data
    };

    const handleDeleteestimate = async (estimateId) => {
        if (!window.confirm("Are you sure you want to delete this estimate?")) return;
        try {
            await axios.delete(`${URL_EST_Delete}/${estimateId}`);
            // Remove the deleted estimate from the list
            setestimateList((prev) => prev.filter((estimate) => estimate._id !== estimateId));
            setSuccessMessage("estimate deleted successfully!");
            setShowPopup(true);
        } catch (error) {
            console.error("Error deleting estimate:", error);
            setErrorMessage("Failed to delete estimate.");
            setShowPopup(true);
        }
    };

    const handlePreviousBill = () => {
        if (estimateList.length === 0) return;
        if (currentestimateIndex > 0) {
            const newIndex = currentestimateIndex - 1;
            setCurrentestimateIndex(newIndex);
            handleEditestimate(estimateList[newIndex]);
        }
    };

    const handleNextBill = () => {
        if (estimateList.length === 0) return;
        if (currentestimateIndex < estimateList.length - 1) {
            const newIndex = currentestimateIndex + 1;
            setCurrentestimateIndex(newIndex);
            handleEditestimate(estimateList[newIndex]);
        }
    };

    useEffect(() => {
        setCurrentestimateIndex(-1);
    }, [estimateList]);

    const [showestimatePrintPreModal, setShowestimatePrintPreModal] = useState(false);
    const [selectedestimate, setSelectedestimate] = useState(null);

    const handlePrintPre = (estimate) => {
        setSelectedestimate(estimate);
        setShowestimatePrintPreModal(true);
    };

    const closeModal = () => {
        setShowestimatePrintPreModal(false);
        setSelectedestimate(null);
    };

    // Autofill logic for product selection
    const handleProductSelection = (productName, index) => {
        const product = productList.find(p => p.name === productName);
        if (product) {
            setValue(`products.${index}.name`, productName);
            setValue(`products.${index}.single_price`, product.Price);
            setValue(`products.${index}.scale`, product.Scale);
            setValue(`products.${index}.scaleno`, product.Scaleno);
            setValue(`products.${index}.single_bag_amount`, product.single_bag_amount || "");
            setValue(`products.${index}.bagprice`, product.pagprice);
            setValue(`products.${index}.single_wages_amount`, product.single_wages_amount || "");
            setValue(`products.${index}.Wages`, product.Wages);
            setValue(`products.${index}.single_commission_amount`, product.single_commission_amount || "");
            setValue(`products.${index}.commission`, product.commission);
        }
    };
  
    const autocalculation = (e,index) => {
        const value = e.target.value;
            if(value){
            const quantity = getValues(`products.${index}.quantity`);
            const single_price = getValues(`products.${index}.single_price`);
            const price = (quantity * single_price).toFixed(2);
            setValue(`products.${index}.price`, price);
            
            }
    };
    const handleCustomerChange = (e) => {
        const value = e.target.value;
        setValue("customer.name", value);
    };

    return (
        <div className="mobile-estimate-container">
           <div className="main-grid">
            <div className="bill-form">
            <h6 style={{textAlign: "center", marginBottom: '3px'}}>Estimate Entry</h6>

            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bill-top">
                    <div >
                        <label htmlFor="customer">Customer</label>
                        <br />
                        <input type="text" id="customer" className="customer-input" {...register("customer.name")}
                        onChange={(e) => handleCustomerChange(e)}
                        list="customerSuggestions"
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setTimeout(() => {
                                    productNameRef.current && productNameRef.current.focus();
                                }, 0);
                            }
                        }}
                        required
                         />
                         <datalist id="customerSuggestions">
                            {customerList.map((customer, idx) => (
                                <option key={idx} value={customer.name} />
                            ))}
                        </datalist>
                        
                    </div>
                    <div >
                    <div><label htmlFor="old_balance">
                            Old Balance: {selectedCustomer?.oldBalance}
                        </label></div>
                        <div>
                            <label htmlFor="" >bill No:{selectedCustomer?.billnumber}</label>
                        </div>
                        </div>
                    <div>
                                <label htmlFor="bill_details">Bill Details</label>
                                <input type="date" id="bill_details" {...register("bill_details.date")} />
                            <br/>
                                <label htmlFor="bill_details">Bill Date</label>
                                <input type="date" id="bill_details" {...register("bill_details.bill_date")} readOnly />
            </div> 
                        </div>
                            <div className="product-input-grid">
                                <div className="product-input-field">
                                    <label>Product Name</label>
                                    <br/>
                                    <input 
                                        type="text" 
                                        name="productname" 
                                        value={product.name} 
                                        list="productSuggestions"
                                        placeholder="Product Name"
                                        ref={productNameRef}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            
                                            const found = productList.find(p => p.name === name);
                                            console.log(found);
                                            setProduct({
                                                ...product,
                                                name,
                                                single_price: found ? found.Price : "",
                                                scale: found ? found.Scale : "",
                                                scaleno: found ? found.Scaleno : "",
                                                gstpre: found ? found.gstpre : "",
                                                cgst: found ? found.cgst : "",
                                                sgst: found ? found.sgst : "",
                                                crossprice: found ? found.crossprice : "",
                                                crossprice_total: found ? found.crossprice_total : "",
                                                single_bag_amount: found ? found.single_bag_amount : "",
                                                bagprice: found ? found.pagprice : "",
                                                single_wages_amount: found ? found.single_wages_amount : "",
                                                Wages: found ? found.Wages : "",
                                                single_commission_amount: found ? found.single_commission_amount : "",
                                                commission: found ? found.commission : "",
                                            });
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                commentRef.current && commentRef.current.focus();
                                            }
                                        }}
                                    />
                                    <datalist id="productSuggestions">
                                        {productList.map((product, idx) => (
                                            <option key={idx} value={product.name} /> 
                                        ))}
                                    </datalist>
                                </div>
                                
                                <div className="product-input-field ">
                                    <label>Comment</label>
                                    <br/>
                                    <input 
                                        type="text" 
                                        name="comment" 
                                        placeholder="Comment"
                                        value={product.comment}
                                        onChange={e => setProduct({ ...product, comment: e.target.value })}
                                        ref={commentRef}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const expr = e.target.value;
                                                // Only allow numbers and +, -, *, /, .
                                                if (/^[\d+\-*/. ]+$/.test(expr)) {
                                                    try {
                                                        // Count numbers in the expression
                                                        const numbers = expr.match(/[\d.]+/g);
                                                        const count = numbers ? numbers.length : 0;
                                                        // eslint-disable-next-line no-eval
                                                        const result = eval(expr);
                                                        if (!isNaN(result)) {
                                                            setProduct({
                                                                ...product,
                                                                comment: expr,
                                                                quantity: result.toString(),
                                                                scaleno: count.toString()
                                                            });
                                                            quantityRef.current && quantityRef.current.focus();
                                                            return;
                                                        }
                                                    } catch (err) {
                                                        // Ignore errors, just focus next
                                                    }
                                                }
                                                quantityRef.current && quantityRef.current.focus();
                                            }
                                        }}
                                    />
                                </div>
                                
                                <div className="product-input-field">
                                    <label>Quantity</label>
                                    <br/>
                                    <input 
                                        type="number" 
                                        name="quantity" 
                                        value={product.quantity} 
                                        className="smallInput"
                                        onChange={e => setProduct({ ...product, quantity: e.target.value })}
                                        placeholder="Quantity"
                                        ref={quantityRef}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                singlePriceRef.current && singlePriceRef.current.focus();
                                            }
                                        }}
                                    /> 
                                </div>
                                
                                <div className="product-input-field">
                                    <label>Single Price</label>
                                    <br/>
                                    <input 
                                        type="number" 
                                        name="single_price" 
                                        value={product.single_price} 
                                        className="smallInput"
                                        onChange={(e) => setProduct({...product, single_price: e.target.value})}
                                        placeholder="Price"
                                        ref={singlePriceRef}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddProduct();
                                                productNameRef.current && productNameRef.current.focus();
                                            }
                                        }}
                                    /> 
                                </div>
                                
                                <div style={{ alignSelf: 'end' }}>
                                    <button 
                                        type="button" 
                                        className="add-button"
                                        onClick={handleAddProduct}
                                        disabled={!product.name || !product.quantity || !product.single_price}
                                    >
                                        Add 
                                    </button>
                                </div>
                            </div>
                <div className="table-wrapper" style={{height: "200px", overflow: "auto"}}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Comment</th> {/* <-- Add this header */}
                                <th>Quantity</th>
                                <th>Single Price</th>
                                <th>Scale</th>

                                <th>scaleno</th>
                                <th>tgstpre</th>
                                <th>crossprice</th>
                                <th>crossprice_total</th>
                                <th>Cgst</th>
                                <th>sgst</th>
                                <th>bagprice</th>
                                <th>Wages</th>
                                <th>commission</th>
                                <th>Price</th>
                                <th>Action</th>
                                <th>S/B Amo</th>
                                <th>S/W Amo</th>
                                <th>S/w Amo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.name`)}
                                            placeholder="Product Name"
                                            list="productSuggestions"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.comment"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.comment`)}
                                            placeholder="Comment"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.quantity"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.quantity`)}
                                            placeholder="Quantity"
                                            className="smallInput"
                                            onChange={e => {
                                                // Update quantity
                                                setValue(`products.${index}.quantity`, e.target.value);
                                                // Auto-calculate price
                                                const quantity = parseFloat(e.target.value) || 0;
                                                const singlePrice = parseFloat(getValues(`products.${index}.single_price`)) || 0;
                                                setValue(`products.${index}.price`, (quantity * singlePrice).toFixed(2));
                                                const wages = getValues(`products.${index}.single_wages_amount`)
                                                const commission = getValues(`products.${index}.single_commission_amount`)
                                                const bagprice = getValues(`products.${index}.single_bag_amount`)
                                                setValue(`products.${index}.Wages`, (wages * quantity).toFixed(2))
                                                setValue(`products.${index}.commission`, (commission * quantity).toFixed(2))
                                                setValue(`products.${index}.bagprice`, (bagprice * quantity).toFixed(2))
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.single_price"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            {...register(`products.${index}.single_price`)}
                                            placeholder="Single Price"
                                            className="smallInput"
                                            onChange={e => {
                                                // Update single price
                                                setValue(`products.${index}.single_price`, e.target.value);
                                                // Auto-calculate price
                                                const singlePrice = parseFloat(e.target.value) || 0;
                                                const quantity = parseFloat(getValues(`products.${index}.quantity`)) || 0;
                                                setValue(`products.${index}.price`, (quantity * singlePrice).toFixed(2));
                                                const wages = getValues(`products.${index}.single_wages_amount`)
                                                const commission = getValues(`products.${index}.single_commission_amount`)
                                                const bagprice = getValues(`products.${index}.single_bag_amount`)
                                                setValue(`products.${index}.Wages`, (wages * quantity).toFixed(2))
                                                setValue(`products.${index}.commission`, (commission * quantity).toFixed(2))
                                                setValue(`products.${index}.bagprice`, (bagprice * quantity).toFixed(2))
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.scale"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.scale`)}
                                            placeholder="Scale"
                                            className="smallInput"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.scaleno"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.scaleno`)}
                                            placeholder="scaleno"
                                            className="smallInput"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td><input
                                    type="text"
                                    {...register(`products.${index}.tgstpre`)}
                                    placeholder="tgstpre"
                                    className="smallInput"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const nextField = document.querySelector(`input[name="products.${index}.crossprice"]`);
                                            if (nextField) nextField.focus();
                                        }
                                    }}
                                /></td>
                                <td><input
                                    type="text"
                                    {...register(`products.${index}.crossprice`)}
                                    placeholder="crossprice"
                                    className="smallInput"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`);
                                            if (nextField) nextField.focus();
                                        }
                                    }}
                                /></td>
                                <td><input type="text" {...register(`products.${index}.crossprice_total`)} placeholder="crossprice_total" className="smallInput" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`); if (nextField) nextField.focus(); } }} /></td>
                                    <td><input
                                    type="text"
                                    {...register(`products.${index}.cgst`)}
                                    placeholder="cgst"
                                    className="smallInput"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`);
                                            if (nextField) nextField.focus();
                                        }
                                    }}
                                /></td>
                                <td><input
                                    type="text"
                                    {...register(`products.${index}.sgst`)}
                                    placeholder="sgst"
                                    className="smallInput"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`);
                                            if (nextField) nextField.focus();
                                        }
                                    }}
                                /></td>
                                {/* <td><input
                                    type="text"
                                    {...register(`products.${index}.crossprice_total`)}
                                    placeholder="crossprice_total"
                                    className="smallInput"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`);
                                            if (nextField) nextField.focus();
                                        }
                                    }}
                                /></td> */}
                                {/* <td><input
                                    type="text"
                                    {...register(`products.${index}.crossprice_total`)}
                                    placeholder="crossprice_total"
                                    className="smallInput"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            const nextField = document.querySelector(`input[name="products.${index}.bagprice"]`);
                                            if (nextField) nextField.focus();
                                        }
                                    }}
                                /></td> */}
                                    <td>
                                    
                                        <input
                                            type="text"
                                            {...register(`products.${index}.bagprice`)}
                                            placeholder="bagprice"
                                            className="smallInput"
                                            onChange={e => {
                                                setValue(`products.${index}.bagprice`, e.target.value);
                                                // Recalculate price
                                                const quantity = parseFloat(getValues(`products.${index}.quantity`)) || 0;
                                                const singlePrice = parseFloat(getValues(`products.${index}.single_price`)) || 0;
                                                const bagprice = parseFloat(e.target.value) || 0;
                                                const Wages = parseFloat(getValues(`products.${index}.Wages`)) || 0;
                                                const commission = parseFloat(getValues(`products.${index}.commission`)) || 0;
                                                setValue(
                                                    `products.${index}.price`,
                                                    (quantity * singlePrice + bagprice + Wages + commission).toFixed(2)
                                                );
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.Wages"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.Wages`)}
                                            placeholder="Wages"
                                            className="smallInput"
                                            onChange={e => {
                                                setValue(`products.${index}.Wages`, e.target.value);
                                                // Recalculate price
                                                const quantity = parseFloat(getValues(`products.${index}.quantity`)) || 0;
                                                const singlePrice = parseFloat(getValues(`products.${index}.single_price`)) || 0;
                                                const bagprice = parseFloat(getValues(`products.${index}.bagprice`)) || 0;
                                                const Wages = parseFloat(e.target.value) || 0;
                                                const commission = parseFloat(getValues(`products.${index}.commission`)) || 0;
                                                setValue(
                                                    `products.${index}.price`,
                                                    (quantity * singlePrice + bagprice + Wages + commission).toFixed(2)
                                                );
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.commission"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.commission`)}
                                            placeholder="commission"
                                            className="smallInput"
                                            onChange={e => {
                                                setValue(`products.${index}.commission`, e.target.value);
                                                // Recalculate price
                                                const quantity = parseFloat(getValues(`products.${index}.quantity`)) || 0;
                                                const singlePrice = parseFloat(getValues(`products.${index}.single_price`)) || 0;
                                                const bagprice = parseFloat(getValues(`products.${index}.bagprice`)) || 0;
                                                const Wages = parseFloat(getValues(`products.${index}.Wages`)) || 0;
                                                const commission = parseFloat(e.target.value) || 0;
                                                setValue(
                                                    `products.${index}.price`,
                                                    (quantity * singlePrice + bagprice + Wages + commission).toFixed(2)
                                                );
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.single_bag_amount"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            {...register(`products.${index}.price`)}
                                            placeholder="Price"
                                            readOnly
                                            className="smallInput"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    // Move to next product's name field
                                                    const nextProductField = document.querySelector(`input[name="products.${index + 1}.name"]`);
                                                    if (nextProductField) {
                                                        nextProductField.focus();
                                                    } else {
                                                        // If no next product row exists, you could add a new product or focus on another field
                                                        // For now, let's focus on the add product button or first available input
                                                        const addButton = document.querySelector('button[type="button"]');
                                                        if (addButton && addButton.textContent.includes('Add')) {
                                                            addButton.focus();
                                                        }
                                                    }
                                                }
                                            }}
                                            />
                                    </td>
                                    <td>
                                        <button type="button" onClick={() => remove(index)}>
                                            &#x2715;
                                        </button>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.single_bag_amount`)}
                                            placeholder="Single Bag Amount"
                                            className="smallInput"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.single_wages_amount"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.single_wages_amount`)}
                                            placeholder="Single Wages Amount"
                                            className="smallInput"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    const nextField = document.querySelector(`input[name="products.${index}.single_commission_amount"]`);
                                                    if (nextField) nextField.focus();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            {...register(`products.${index}.single_commission_amount`)}
                                            placeholder="Single Commission Amount"
                                            className="smallInput"
                                            onKeyDown={e => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    // Move to next row's first field or add new product
                                                    const nextRowField = document.querySelector(`input[name="products.${index + 1}.name"]`);
                                                    if (nextRowField) {
                                                        nextRowField.focus();
                                                    } else {
                                                        // If no next row, focus on the add product button or first input field
                                                        const addButton = document.querySelector('button[type="button"]');
                                                        if (addButton && addButton.textContent.includes('Add')) {
                                                            addButton.focus();
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    
                </div>

                <hr />
                <div className="bill-details-grid">
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Transport:</p>
                        <input
                            type="text"
                            {...register("bill_details.transport")}
                            placeholder="Transport"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Total Quantity:</p>
                        <input
                            type="number"
                            {...register("bill_details.total_quantity")}
                            placeholder="Total Quantity"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Total Bag Price:</p>
                        <input
                            type="text"
                            {...register("bill_details.totalbagprice")}
                            placeholder="Total Bag Price"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Total Wages:</p>
                        <input
                            type="number"
                            {...register("bill_details.totalWages")}
                            placeholder="Total Wages"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>T/Comm:</p>
                        <input
                            type="number"
                            {...register("bill_details.totalcommission")}
                            placeholder="Total Commission"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Credit:</p>
                        <input
                            type="number"
                            {...register("bill_details.credit")}
                            placeholder="Credit"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Cash:</p>
                        <input
                            type="number"
                            {...register("bill_details.cash")}
                            placeholder="Cash"
                            onKeyDown={e => handleKeyDown(e)}
                            className="smallInput"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Old Balance:</p>
                        <input
                            type="number"
                            {...register("bill_details.old_balance")}
                            placeholder="Old Balance"
                            value={selectedCustomer ? selectedCustomer.oldBalance : ""}
                            readOnly
                            className="smallInput readonly-input"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>New Balance:</p>
                        <input
                            type="number"
                            {...register("bill_details.new_balance")}
                            placeholder="New Balance"
                            readOnly
                            value={newBalance}
                            className=" smallInput readonly-input"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Subtotal:</p>
                        <input
                            type="number"
                            {...register("bill_details.subtotal")}
                            placeholder="Subtotal"      
                            onKeyDown={e => handleKeyDown(e)}
                            readOnly
                            className="bill-details-input readonly-input"
                        />
                    </div>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Bill Amount:</p>
                        <input
                            type="number"
                            {...register("bill_details.bill_amount")}
                            placeholder="Bill Amount"
                            onKeyDown={e => handleKeyDown(e)}
                            readOnly
                            className="bill-details-input readonly-input"
                        />
                    </div>
                </div>
                                <div><button type="submit" className="submit-button">{formMode === 'EDIT' ? 'estimate Bill Update' : formMode === 'CONVERT' ? 'estimate Bill Convert' : 'Submit'}</button>
                 </div>
               
                <div className="action-buttons">
                    <button type="button" className="action-button" onClick={handlePreviousBill} disabled={currentestimateIndex <= 0}>
                        Previous
                    </button>
                    <button type="button" className="action-button" onClick={handleNextBill} disabled={currentestimateIndex === -1 || currentestimateIndex >= estimateList.length - 1}>
                        Next
                    </button>
                    <button
                        type="button"
                        className="action-button"
                        onClick={() => handlePrintPre(estimateList[currentestimateIndex])}
                        disabled={currentestimateIndex === -1}
                    >
                        Print
                    </button>
                    <button
                        type="button"
                        className="action-button"
                        onClick={() => handleDeleteestimate(estimateList[currentestimateIndex]?._id)}
                        disabled={currentestimateIndex === -1}
                    >
                        Delete
                    </button>
                </div>
            </form>
            </div>
            <div>
            <div className="sidebar">
                <input
                    type="date"
                    className="date-filter"
                    name="date-filter"
                    value={selectedDate}
                    onChange={handleestimateDateChange}
                />
                <table className="sidebar-table">
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>Name</th>
                            <th>Vi</th>
                            <th>Ed</th>
                            <th>Del</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList && orderList.length > 0 ? (
                            orderList.map((estimate, index) => (
                                <tr key={estimate._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{estimate.customer?.name}</td>
                                    <td style={{ cursor: "pointer" }} onClick={() => handlePrintPre(estimate)}>
                                        <FaEye />
                                    </td>
                                    <td>
                                        <button className="icon-button" onClick={() => handleSelectOrder(estimate)}>
                                            <FaRegEdit />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="icon-button"
                                            onClick={() => handleDeleteestimate(estimate._id)}
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} style={{ textAlign: 'center' }}>No estimates found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="sidebar">
                <input
                    type="date"
                    className="date-filter"
                    name="date-filter"
                    value={selectedDate}
                    onChange={handleestimateDateChange}
                />
                <table className="sidebar-table">
                    <thead>
                        <tr>
                            <th>no</th>
                            <th>Name</th>
                            <th>Vi</th>
                            <th>Ed</th>
                            <th>Del</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimateList && estimateList.length > 0 ? (
                            estimateList.map((estimate, index) => (
                                <tr key={estimate._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{estimate.customer?.name}</td>
                                    <td style={{ cursor: "pointer" }} onClick={() => handlePrintPre(estimate)}>
                                        <FaEye />
                                    </td>
                                    <td>
                                        <button className="icon-button" onClick={() => handleEditestimate(estimate)}>
                                            <FaRegEdit />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="icon-button"
                                            onClick={() => handleDeleteestimate(estimate._id)}
                                        >
                                            <MdDeleteOutline />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} style={{ textAlign: 'center' }}>No estimates found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            </div>

           </div>
          
            <hr />
            {showestimatePrintPreModal && (
    <EstimatePrintPre selectedOrder={selectedestimate} closeModal={closeModal} />
      )}
        </div>
  
    );
};

export default EstimateEntry;
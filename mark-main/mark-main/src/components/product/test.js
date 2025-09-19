// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { URL_PRO_add, URL_PRO_list } from "../url/url";
// import "./productcc.css";

// const Product = () => {
//   const [productList, setProductList] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     Malayalam: "",
//     Tamil: "",
//     Scale: "",
//     Price: "",
//     pagprice: "",
//     Wages: "",
//     commission: "",
//     category: "",
//     StockQunity: "",
//   });

//   useEffect(() => {
//     fetchProduct();
//   }, []);

//   const fetchProduct = async () => {
//     try {
//       const res = await axios.get(URL_PRO_list);
//       setProductList(res.data);
//     } catch (error) {
//       console.error("Error fetching product list:", error);
//     }
//   };

//   const categories = ["Liews"];

//   const openModal = (e) => {
//     e.preventDefault();
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(URL_PRO_add, form);
//       fetchProduct();
//       closeModal();
//       setForm({
//         name: "",
//         Malayalam: "",
//         Tamil: "",
//         Scale: "",
//         Price: "",
//         pagprice: "",
//         Wages: "",
//         commission: "",
//         category: "",
//         StockQunity: "",
//       });
//     } catch (error) {
//       console.error("Error adding product:", error);
//     }
//   };

//   return (
//     <>
//       <h3>Product List</h3>
//       <div className="row">
//         <div className="col-6">
//           <label>Search product</label>
//           <input type="text" />
//         </div>
//         <div className="col-6">
//           <button onClick={openModal}>Add</button>
//         </div>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>S.no</th>
//             <th>Name</th>
//             <th className="desktop-view">Malayalam name</th>
//             <th className="desktop-view">Tamil name</th>
//             <th>Scale</th>
//             <th>Price</th>
//             <th>pagprice</th>
//             <th>Wages</th>
//             <th>commission</th>
//             <th>category</th>
//             <th>Stock Qunity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {productList.map((product, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{product.name}</td>
//               <td>{product.Malayalam}</td>
//               <td>{product.Tamil}</td>
//               <td>{product.Scale}</td>
//               <td>{product.Price}</td>
//               <td>{product.pagprice}</td>
//               <td>{product.Wages}</td>
//               <td>{product.commission}</td>
//               <td>{product.category}</td>
//               <td>{product.StockQunity}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {isModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={closeModal}>
//               &times;
//             </span>
//             <h2>Add Product</h2>
//             <form onSubmit={handleSubmit}>
//               <table>
//                 <tr key=""></tr>
//               </table>
//               <div>
//                 <p>Product Name:</p>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="Name"
//                 />
//               </div>
//               <div>
//                 <p>Malayalam Name:</p>
//                 <input
//                   type="text"
//                   name="Malayalam"
//                   value={form.Malayalam}
//                   onChange={handleChange}
//                   placeholder="Malayalam Name"
//                 />
//               </div>
//               <div>
//                 <p>Tamil Name:</p>
//                 <input
//                   type="text"
//                   name="Tamil"
//                   value={form.Tamil}
//                   onChange={handleChange}
//                   placeholder="Tamil Name"
//                 />
//               </div>
//               <div>
//                 <p>Scale:</p>
//                 <input
//                   type="text"
//                   name="Scale"
//                   value={form.Scale}
//                   onChange={handleChange}
//                   placeholder="Scale"
//                 />
//               </div>
//               <div>
//                 <p>Price:</p>
//                 <input
//                   type="text"
//                   name="Price"
//                   value={form.Price}
//                   onChange={handleChange}
//                   placeholder="Price"
//                 />
//               </div>
//               <div>
//                 <p>pagprice:</p>
//                 <input
//                   type="text"
//                   name="pagprice"
//                   value={form.pagprice}
//                   onChange={handleChange}
//                   placeholder="pagprice"
//                 />
//               </div>
//               <div>
//                 <p>Wages:</p>
//                 <input
//                   type="text"
//                   name="Wages"
//                   value={form.Wages}
//                   onChange={handleChange}
//                   placeholder="Wages"
//                 />
//               </div>
//               <div>
//                 <p>commission:</p>
//                 <input
//                   type="text"
//                   name="commission"
//                   value={form.commission}
//                   onChange={handleChange}
//                   placeholder="commission"
//                 />
//               </div>
//               <div>
//                 <p>Category:</p>
//                 <select name="category" value={form.category} onChange={handleChange}>
//                   <option value="">Select a category</option>
//                   {categories.map((category, index) => (
//                     <option key={index} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <p>StockQunity:</p>
//                 <input
//                   type="text"
//                   name="StockQunity"
//                   value={form.StockQunity}
//                   onChange={handleChange}
//                   placeholder="StockQunity"
//                 />
//               </div>

//               <button type="submit">Add Product</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Product;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { URL_PRO_add, URL_PRO_list } from "../url/url";
import "./productcc.css";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      Malayalam: "",
      Tamil: "",
      Scale: "",
      Price: "",
      gstpre: "",
      pagprice: "",
      Wages: "",
      commission: "",
      category: "",
      entries: [
        {
          serialNumber: "",
          date: "",
          patchNumber: "",
        },
      ],
      StockQunity: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(URL_PRO_list);
      setProductList(res.data);
    } catch (error) {
      console.error("Error fetching product list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (items, { key, direction }) => {
    if (!key) return items;
    
    return [...items].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredProducts = useMemo(() => {
    let filtered = productList;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        Object.values(product).some(
          val => val && val.toString().toLowerCase().includes(searchTerm)
        )
      );
    }
    
    return getSortedData(filtered, sortConfig);
  }, [productList, searchTerm, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="sort-icon active" /> 
      : <FaSortDown className="sort-icon active" />;
  };

  const categories = ["Liews"];

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(URL_PRO_add, data);
      fetchProduct();
      closeModal();
      reset();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Product List</h2>
        <div className="product-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button className="add-button" onClick={openModal}>
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  <div className="header-cell">
                    Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th onClick={() => requestSort('Price')}>
                  <div className="header-cell">
                    Price
                    {getSortIcon('Price')}
                  </div>
                </th>
                <th onClick={() => requestSort('gstpre')}>
                  <div className="header-cell">
                    GST %
                    {getSortIcon('gstpre')}
                  </div>
                </th>
                <th onClick={() => requestSort('pagprice')}>
                  <div className="header-cell">
                    Purchase Price
                    {getSortIcon('pagprice')}
                  </div>
                </th>
                <th onClick={() => requestSort('StockQunity')}>
                  <div className="header-cell">
                    Stock
                    {getSortIcon('StockQunity')}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product._id || index}>
                    <td>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-details">
                          {product.Malayalam && <span>{product.Malayalam}</span>}
                          {product.Tamil && <span>{product.Tamil}</span>}
                          {product.Scale && <span>Scale: {product.Scale}</span>}
                        </div>
                      </div>
                    </td>
                    <td>₹{parseFloat(product.Price || 0).toFixed(2)}</td>
                    <td>{product.gstpre}%</td>
                    <td>₹{parseFloat(product.pagprice || 0).toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${product.StockQunity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.StockQunity} {product.StockQunity === 1 ? 'unit' : 'units'}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="icon-button edit" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="icon-button delete" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    {searchTerm ? 'No products match your search' : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <table>
                <tr key=""></tr>
              </table>
              <div>
                <p>Product Name:</p>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  {...register("name")}
                />
              </div>
              <div>
                <p>Malayalam Name:</p>
                <input
                  type="text"
                  name="Malayalam"
                  placeholder="Malayalam Name"
                  {...register("Malayalam")}
                />
              </div>
              <div>
                <p>Tamil Name:</p>
                <input
                  type="text"
                  name="Tamil"
                  placeholder="Tamil Name"
                  {...register("Tamil")}
                />
              </div>
              <div>
                <p>Scale:</p>
                <input
                  type="text"
                  name="Scale"
                  placeholder="Scale"
                  {...register("Scale")}
                />
              </div>
              <div>
                <p>Price:</p>
                <input
                  type="text"
                  name="Price"
                  placeholder="Price"
                  {...register("Price")}
                />
              </div>
              <div>
                <p>gstpre:</p>
                <input
                  type="text"
                  name="gstpre"
                  placeholder="gstpre"
                  {...register("gstpre")}
                />
              </div>
              <div>
                <p>Cgst:</p>
                <input
                  type="text"
                  name="cgst"
                  placeholder="cgst"
                  {...register("cgst")}
                />
              </div>
              <div>
                <p>Sgst:</p>
                <input
                  type="text"
                  name="sgst"
                  placeholder="sgst"
                  {...register("sgst")}
                />
              </div>
              <div>
                <p>pagprice:</p>
                <input
                  type="text"
                  name="pagprice"
                  placeholder="pagprice"
                  {...register("pagprice")}
                />
              </div>
              <div>
                <p>Wages:</p>
                <input
                  type="text"
                  name="Wages"
                  placeholder="Wages"
                  {...register("Wages")}
                />
              </div>
              <div>
                <p>commission:</p>
                <input
                  type="text"
                  name="commission"
                  placeholder="commission"
                  {...register("commission")}
                />
              </div>
              <div>
                <p>Category:</p>
                <select name="category" {...register("category")}>
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p>Entries:</p>
                {fields.map((entry, index) => (
                  <div key={entry.id} className="entry">
                    <div>
                      <p>Serial Number:</p>
                      <input
                        type="text"
                        placeholder="Serial Number"
                        {...register(`entries.${index}.serialNumber`)}
                      />
                    </div>
                    <div>
                      <p>Date:</p>
                      <input
                        type="text"
                        placeholder="Date"
                        {...register(`entries.${index}.date`)}
                      />
                    </div>
                    <div>
                      <p>Patch Number:</p>
                      <input
                        type="text"
                        placeholder="Patch Number"
                        {...register(`entries.${index}.patchNumber`)}
                      />
                    </div>
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    append({ serialNumber: "", date: "", patchNumber: "" })
                  }
                >
                  Add Entry
                </button>
              </div>
              <div>
                <p>pagprice:</p>
                <input
                  type="text"
                  name="StockQunity"
                  placeholder="StockQunity"
                  {...register("StockQunity")}
                />
              </div>

              <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;

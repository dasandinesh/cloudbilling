import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { URL_CompanyNewAdd, URL_CompanyListGet } from "../url/url";

const CompanyList = () => {
  const [companyList, setCompanyList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      branches: [
        {
          name: "",
          code: "",
          address: {
            doorno: "",
            street: "",
            places: "",
            district: "",
            pincode: "",
          },
          estimatefiledoptionsId: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branches",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(URL_CompanyListGet);
      console.log("API Response:", res.data); // Debug log
      
      // Handle different API response structures
      let companies = [];
      if (Array.isArray(res.data)) {
        companies = res.data;
      } else if (res.data && Array.isArray(res.data.companies)) {
        companies = res.data.companies;
      } else if (res.data && Array.isArray(res.data.data)) {
        companies = res.data.data;
      } else {
        console.warn("Unexpected API response structure:", res.data);
        companies = [];
      }
      
      setCompanyList(companies);
    } catch (error) {
      console.error("Error fetching company list:", error);
      setCompanyList([]); // Ensure it's always an array
    }
  };

  const openModal = (e, company = null) => {
    e.preventDefault();
    setIsModalOpen(true);
    if (company) {
      setEditingCompany(company);
      setValue("name", company.name);
      setValue("address", company.address);
      setValue("phone", company.phone);
      setValue("email", company.email);
      reset({
        branches: company.branches,
      });
    } else {
      setEditingCompany(null);
      reset();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const onSubmit = async (data) => {
    try {
      if (editingCompany) {
        // Update existing company
        await axios.put(`${URL_CompanyListGet}/${editingCompany.id}`, data);
      } else {
        // Add new company
        await axios.post(URL_CompanyNewAdd, data);
      }
      fetchCompanies();
      closeModal();
      reset();
    } catch (error) {
      console.error("Error submitting company data:", error);
    }
  };

  const addBranch = () => {
    append({
      name: "",
      code: "",
      address: {
        doorno: "",
        street: "",
        places: "",
        district: "",
        pincode: "",
      },
    });
  };

  return (
    <>
      <h3>Company List</h3>
      <div className="row">
        <div className="col-6">
          <label>Search Company</label>
          <input type="text" />
        </div>
        <div className="col-6">
          <button onClick={(e) => openModal(e)}>Add</button>
        </div>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Branches</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(companyList) && companyList.length > 0 ? (
            companyList.map((company, index) => (
              <tr key={company.id || index}>
                <td>{company.name || 'N/A'}</td>
                <td>{company.address || 'N/A'}</td>
                <td>{company.phone || 'N/A'}</td>
                <td>{company.email || 'N/A'}</td>
                <td>
                  {Array.isArray(company.branches) && company.branches.length > 0 ? (
                    <ul>
                      {company.branches.map((branch, branchIndex) => (
                        <li key={branch.id || branchIndex}>{branch.name || 'Unnamed Branch'}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No branches</span>
                  )}
                </td>
                <td>
                  <button onClick={(e) => openModal(e, company)}>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                {companyList === null ? 'Loading companies...' : 'No companies found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{editingCompany ? "Edit Company" : "Add Company"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Company Name</label>
              <input type="text" {...register("name")} />
              <br />
              <br />

              <label>Company Address</label>
              <input type="text" {...register("address")} />
              <br />
              <br />

              <label>Company Phone</label>
              <input type="text" {...register("phone")} />
              <br />
              <br />

              <label>Company Email</label>
              <input type="email" {...register("email")} />
              <br />
              <br />

              {fields.map((branch, index) => (
                <React.Fragment key={branch.id}>
                  <h4>Branch {index + 1}</h4>

                  <label>Branch Name</label>
                  <input type="text" {...register(`branches.${index}.name`)} />
                  <br />
                  <br />

                  <label>Branch Code</label>
                  <input type="text" {...register(`branches.${index}.code`)} />
                  <br />
                  <br />

                  <label>Door Number</label>
                  <input
                    type="text"
                    {...register(`branches.${index}.address.doorno`)}
                  />
                  <br />
                  <br />

                  <label>Street</label>
                  <input
                    type="text"
                    {...register(`branches.${index}.address.street`)}
                  />
                  <br />
                  <br />

                  <label>Places</label>
                  <input
                    type="text"
                    {...register(`branches.${index}.address.places`)}
                  />
                  <br />
                  <br />

                  <label>District</label>
                  <input
                    type="text"
                    {...register(`branches.${index}.address.district`)}
                  />
                  <br />
                  <br />

                  <label>Pincode</label>
                  <input
                    type="text"
                    {...register(`branches.${index}.address.pincode`)}
                  />
                  <br />
                  <br />

                  <button type="button" onClick={() => remove(index)}>
                    Remove Branch
                  </button>
                </React.Fragment>
              ))}

              <button type="button" onClick={addBranch}>
                Add Branch
              </button>
              <br />
              <br />
              <button type="submit">
                {editingCompany ? "Update Company" : "Add Company"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyList;

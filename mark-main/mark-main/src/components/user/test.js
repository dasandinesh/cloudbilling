import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { URL_CompanyNewAdd, URL_CompanyListGet } from "../url/url";

const UserList = () => {
  const [companyList, setCompanyList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      UserName: "",
      address: "",
      phone: "",
      email: "",
      Roll: "",
      branchesID: [],
      companyId: [],
      pageId: "",
      orderpageID: "",
      purchasepageSettingID: "",
      PurchaseInvoiceSettingID: "",
      orderSettingId: "",
      estimateSettingID: "",
      SaleEntrypageSettingId: "",
      SaleEntryreceiptSettingId: "",
      //page access setting
      page: {
        order: false,
        purchase: false,
        sales: false,
        estimate: false,
        master: false,
        customer: false,
        product: false,
        company: false,
        user: false,
        account: false,
        ledger: false,
        receipt: false,
        Expence: false,
        report: false,
      },
      //order page
      orderpage: {
        bill_form: false,
        serial_no: false,
        description: false,
        hsn: false,
        gstpre: false,
        cross_price: false,
        cross_price_total: false,
        cgst: false,
        sgst: false,
        scale_no: false,
        bag_price: false,
        wages: false,
        commission: false,
      },
      // purchasepageSetting
      purchasepageSetting: {
        bill_form: false,
        serial_no: false,
        description: false,
        hsn: false,
        gstpre: false,
        cross_price: false,
        cross_price_total: false,
        cgst: false,
        sgst: false,
        scale_no: false,
        bag_price: false,
        wages: false,
        commission: false,
      },

      // Purchase invoice
      PurchaseInvoiceSetting: {
        bill_form: false,
        serial_no: false,
        description: false,
        hsn: false,
        gstpre: false,
        cross_price: false,
        cross_price_total: false,
        cgst: false,
        sgst: false,
        scale_no: false,
        bag_price: false,
        wages: false,
        commission: false,
      },
      // Sales form settings
      SaleEntrypageSetting: {
        bill_form_form: false,
        serial_no_form: false,
        description_form: false,
        hsn_form: false,
        gstpre_form: false,
        cross_price_form: false,
        cross_price_total_form: false,
        cgst_false: false,
        sgst_false: false,
        scale_no_form: false,
        bag_price_form: false,
        wages_form: false,
        commission_form: false,
        transport_form: false,
        shipping_bill_address: false,
        banking_details: false,
      },
      // Sales settings
      SaleEntryreceiptSetting: {
        bill_form_invoice: false,
        serial_no_invoice: false,
        description_invoice: false,
        hsn_invoice: false,
        gstpre_invoice: false,
        cross_price_invoice: false,
        cross_price_total_invoice: false,
        cgst_invoice: false,
        sgst_invoice: false,
        scale_no_invoice: false,
        bag_price_invoice: false,
        wages_invoice: false,
        commission_invoice: false,
        transport_invoice: false,
        shipping_bill_address: false,
        banking_details: false,
      },
      // Estimate settings
      estimateForm: {
        bill_form: false,
        serial_no: false,
        description: false,
        hsn: false,
        gstpre: false,
        cross_price: false,
        cross_price_total: false,
        cgst: false,
        sgst: false,
        scale_no: false,
        bag_price: false,
        wages: false,
        commission: false,
      },

      // Estimate settings
      estimateBill: {
        bill_form: false,
        serial_no: false,
        description: false,
        hsn: false,
        gstpre: false,
        cross_price: false,
        cross_price_total: false,
        cgst: false,
        sgst: false,
        scale_no: false,
        bag_price: false,
        wages: false,
        commission: false,
      },
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
      setCompanyList(res.data);
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  };

  const openModal = (e, company = null) => {
    e.preventDefault();
    setIsModalOpen(true);
    if (company) {
      setEditingCompany(company);
      setValue("UserName", company.UserName);
      setValue("address", company.address);
      setValue("phone", company.phone);
      setValue("email", company.email);
      setValue("Roll", company.Roll);
      setValue("branchesID", company.branchesID);
      setValue("companyId", company.companyId);
      setValue("purchaseSettingID", company.purchaseSettingID);
      setValue("orderSettingId", company.orderSettingId);
      setValue("estimateSettingID", company.estimateSettingID);
      setValue("SaleEntrySettingId", company.SaleEntrySettingId);
      setValue("SaleEntryreceiptSettingId", company.SaleEntryreceiptSettingId);
      reset({
        branches: company.branches || [],
        purchase: company.purchase || {
          bill_form: false,
          serial_no: false,
          description: false,
          hsn: false,
          gstpre: false,
          cross_price: false,
          cross_price_total: false,
          cgst: false,
          sgst: false,
          scale_no: false,
          bag_price: false,
          wages: false,
          commission: false,
        },
        sales: company.sales || {
          bill_form_invoice: false,
          serial_no_invoice: false,
          description_invoice: false,
          hsn_invoice: false,
          gstpre_invoice: false,
          cross_price_invoice: false,
          cross_price_total_invoice: false,
          cgst_invoice: false,
          sgst_invoice: false,
          scale_no_invoice: false,
          bag_price_invoice: false,
          wages_invoice: false,
          commission_invoice: false,
          transport_invoice: false,
          shipping_bill_address: false,
          banking_details: false,
        },
        estimate: company.estimate || {
          bill_form: false,
          serial_no: false,
          description: false,
          hsn: false,
          gstpre: false,
          cross_price: false,
          cross_price_total: false,
          cgst: false,
          sgst: false,
          scale_no: false,
          bag_price: false,
          wages: false,
          commission: false,
        },
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
          {companyList.map((company, index) => (
            <tr key={index}>
              <td>{company.UserName}</td>
              <td>{company.address}</td>
              <td>{company.phone}</td>
              <td>{company.email}</td>
              <td>
                <ul>
                  {company.branches?.map((branch, branchIndex) => (
                    <li key={branchIndex}>{branch.name}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={(e) => openModal(e, company)}>Edit</button>
              </td>
            </tr>
          ))}
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
              <table>
                <tr key="">
                  <th></th>
                  <td></td>
                </tr>
              </table>
              <table>
                <tr key="">
                  <th>
                    <label>USer Name</label>
                  </th>
                  <td>
                    <input type="text" {...register("UserName")} />
                  </td>
                </tr>
                <tr key="">
                  <th>
                    <label>Address</label>
                  </th>
                  <td>
                    <input type="text" {...register("address")} />
                  </td>
                </tr>
                <tr key="">
                  <th>
                    <label>Phone</label>
                  </th>
                  <td>
                    <input type="text" {...register("phone")} />
                  </td>
                </tr>
                <tr key="">
                  <th>
                    <label>Email</label>
                  </th>
                  <td>
                    <input type="email" {...register("email")} />
                  </td>
                </tr>
                <tr key="">
                  <th>
                    <label>Roll</label>
                  </th>
                  <td>
                    <input type="text" {...register("Roll")} />
                  </td>
                </tr>
                <tr key="">
                  <th>
                    <label>Branches ID</label>
                  </th>
                  <td>
                    <input type="text" {...register("branchesID")} />
                  </td>
                </tr>
                <tr key="">
                  <th>
                    <label>Company ID</label>
                  </th>
                  <td>
                    <input type="text" {...register("companyId")} />
                  </td>
                </tr>
                <tr key="">
                  <th></th>
                  <td></td>
                </tr>
              </table>
              <h3>purchech Settings</h3>

              <div className="table-scroll-container">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Bill Form</th>
                      <th>Serial No</th>
                      <th>Description</th>
                      <th>HSN</th>
                      <th>GST Pre</th>
                      <th>Cross Price</th>
                      <th>Cross Price Total</th>
                      <th>CGST</th>
                      <th>SGST</th>
                      <th>Scale No</th>
                      <th>Bag Price</th>
                      <th>Wages</th>
                      <th>Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.bill_form")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.serial_no")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.description")}
                        />
                      </td>
                      <td>
                        <input type="checkbox" {...register("purchase.hsn")} />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.gstpre")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.cross_price")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.cross_price_total")}
                        />
                      </td>
                      <td>
                        <input type="checkbox" {...register("purchase.cgst")} />
                      </td>
                      <td>
                        <input type="checkbox" {...register("purchase.sgst")} />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.scale_no")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.bag_price")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.wages")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("purchase.commission")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3>Sales Settings</h3>
              <div className="table-scroll-container">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Bill Form Invoice</th>
                      <th>Serial No Invoice</th>
                      <th>Description Invoice</th>
                      <th>HSN Invoice</th>
                      <th>GST Pre Invoice</th>
                      <th>Cross Price Invoice</th>
                      <th>Cross Price Total Invoice</th>
                      <th>CGST Invoice</th>
                      <th>SGST Invoice</th>
                      <th>Scale No Invoice</th>
                      <th>Bag Price Invoice</th>
                      <th>Wages Invoice</th>
                      <th>Commission Invoice</th>
                      <th>Transport Invoice</th>
                      <th>Shipping Bill Address</th>
                      <th>Banking Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.bill_form_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.serial_no_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.description_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.hsn_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.gstpre_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.cross_price_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.cross_price_total_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.cgst_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.sgst_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.scale_no_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.bag_price_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.wages_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.commission_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.transport_invoice")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.shipping_bill_address")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("sales.banking_details")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Estimate Settings</h3>
              <div className="table-scroll-container">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Bill Form</th>
                      <th>Serial No</th>
                      <th>Description</th>
                      <th>HSN</th>
                      <th>GST Pre</th>
                      <th>Cross Price</th>
                      <th>Cross Price Total</th>
                      <th>CGST</th>
                      <th>SGST</th>
                      <th>Scale No</th>
                      <th>Bag Price</th>
                      <th>Wages</th>
                      <th>Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.bill_form")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.serial_no")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.description")}
                        />
                      </td>
                      <td>
                        <input type="checkbox" {...register("estimate.hsn")} />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.gstpre")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.cross_price")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.cross_price_total")}
                        />
                      </td>
                      <td>
                        <input type="checkbox" {...register("estimate.cgst")} />
                      </td>
                      <td>
                        <input type="checkbox" {...register("estimate.sgst")} />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.scale_no")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.bag_price")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.wages")}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          {...register("estimate.commission")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {fields.map((branch, index) => (
                <React.Fragment key={branch.id}>
                  <h4>Branch {index + 1}</h4>

                  <label>Branch Name</label>
                  <input type="text" {...register(`branches.${index}.name`)} />
                  <br />
                  <br />
                  <button type="button" onClick={() => remove(index)}>
                    Remove Branch
                  </button>
                </React.Fragment>
              ))}
              <button type="button" onClick={() => append({})}>
                Add Branch
              </button>
              <br />
              <button type="submit">
                {editingCompany ? "Update user" : "Add user"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default UserList;

exports = async function (payload) {
  const user_db = context.services.get("chit").db("test").collection("user");
  const page_db = context.services
    .get("chit")
    .db("test")
    .collection("pageAccessSettings");
  const order_db = context.services
    .get("chit")
    .db("test")
    .collection("orderPageSettings");
  const purchasepage_db = context.services
    .get("chit")
    .db("test")
    .collection("purchasepage");
  const PurchaseInvoice_db = context.services
    .get("chit")
    .db("test")
    .collection("PurchaseInvoice");
  const SaleEntrypageSetting_db = context.services
    .get("chit")
    .db("test")
    .collection("SaleEntrypageSetting");
  const SaleEntryreceiptSetting_db = context.services
    .get("chit")
    .db("test")
    .collection("SaleEntryreceiptSetting");
  const estimateSetting_db = context.services
    .get("chit")
    .db("test")
    .collection("estimateSetting");
  const estimateBill_db = context.services
    .get("chit")
    .db("test")
    .collection("estimateBill");

  try {
    // Parse the incoming payload
    const data = JSON.parse(payload.body.text());

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    // Insert data into each collection and capture the inserted IDs
    const pageResult = await page_db.insertOne(data.page);
    const orderResult = await order_db.insertOne(data.orderpage);
    const purchasePageResult = await purchasepage_db.insertOne(
      data.purchasepageSetting
    );
    const purchaseInvoiceResult = await PurchaseInvoice_db.insertOne(
      data.PurchaseInvoiceSetting
    );
    const saleEntryPageSettingResult = await SaleEntrypageSetting_db.insertOne(
      data.SaleEntrypageSetting
    );
    const saleEntryReceiptSettingResult =
      await SaleEntryreceiptSetting_db.insertOne(data.SaleEntryreceiptSetting);
    const estimateSettingResult = await estimateSetting_db.insertOne(
      data.estimateForm
    );
    const estimateBillResult = await estimateBill_db.insertOne(
      data.estimateBill
    );

    // Prepare the update object for the user collection
    // const userUpdate = {
    //   pageAccessSettings: {
    //     id: pageResult.insertedId,
    //     data: data.page,
    //   },
    //   orderPageSettings: {
    //     id: orderResult.insertedId,
    //     data: data.orderpage,
    //   },
    //   purchasePageSettings: {
    //     id: purchasePageResult.insertedId,
    //     data: data.purchasepageSetting,
    //   },
    //   purchaseInvoiceSettings: {
    //     id: purchaseInvoiceResult.insertedId,
    //     data: data.PurchaseInvoiceSetting,
    //   },
    //   saleEntryPageSettings: {
    //     id: saleEntryPageSettingResult.insertedId,
    //     data: data.SaleEntrypageSetting,
    //   },
    //   saleEntryReceiptSettings: {
    //     id: saleEntryReceiptSettingResult.insertedId,
    //     data: data.SaleEntryreceiptSetting,
    //   },
    //   estimateFormSettings: {
    //     id: estimateSettingResult.insertedId,
    //     data: data.estimateForm,
    //   },
    //   estimateBillSettings: {
    //     id: estimateBillResult.insertedId,
    //     data: data.estimateBill,
    //   },
    // };
    const user = {
      UserName: data.UserName,
      address: data.address,
      phone: data.phone,
      email: data.email,
      Roll: data.Roll,
      UserpageId: pageResult.insertedId,
      orderpageID: orderResult.insertedId,
      purchasepageSettingID: purchasePageResult.insertedId,
      PurchaseInvoiceSettingID: purchaseInvoiceResult.insertedId,
      estimateSettingID: estimateSettingResult.insertedId,
      SaleEntrypageSettingId: saleEntryPageSettingResult.insertedId,
      SaleEntryreceiptSettingId: saleEntryReceiptSettingResult.insertedId,
    };
    // user add
    const users = await user_db.insertOne(data.user);

    return { success: true, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: error.message };
  }
};

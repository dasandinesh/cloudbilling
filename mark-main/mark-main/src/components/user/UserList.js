import axios from "axios";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { URL_userAdd } from "../url/url";

const MyFormComponent = () => {
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

  const onSubmit = (data) => {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      console.error("Invalid data format:", data);
      return;
    }
    axios
      .post(URL_userAdd, data)
      .then((response) => {
        console.log("Data saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("UserName")} placeholder="User Name" />
      <input {...register("address")} placeholder="Address" />
      <input {...register("phone")} placeholder="Phone" />
      <input {...register("email")} placeholder="Email" />
      <input {...register("Roll")} placeholder="Roll" />
      <input {...register("branchesID")} placeholder="Branches ID" />
      <input {...register("companyId")} placeholder="Company ID" />
      <input {...register("pageId")} placeholder="Page ID" />
      <input {...register("orderpageID")} placeholder="Order Page ID" />
      <input
        {...register("purchasepageSettingID")}
        placeholder="Purchase Page Setting ID"
      />
      <input
        {...register("PurchaseInvoiceSettingID")}
        placeholder="Purchase Invoice Setting ID"
      />
      <input {...register("orderSettingId")} placeholder="Order Setting ID" />
      <input
        {...register("estimateSettingID")}
        placeholder="Estimate Setting ID"
      />
      <input
        {...register("SaleEntrypageSettingId")}
        placeholder="Sale Entry Page Setting ID"
      />
      <input
        {...register("SaleEntryreceiptSettingId")}
        placeholder="Sale Entry Receipt Setting ID"
      />

      <div>
        <h3>Page Access Settings</h3>
        {Object.keys(control._defaultValues.page).map((key) => (
          <label key={key}>
            <input type="checkbox" {...register(`page.${key}`)} />
            {key}
          </label>
        ))}
      </div>

      <div>
        <h3>Order Page Settings</h3>
        {Object.keys(control._defaultValues.orderpage).map((key) => (
          <label key={key}>
            <input type="checkbox" {...register(`orderpage.${key}`)} />
            {key}
          </label>
        ))}
      </div>

      <div>
        <h3>Purchase Page Settings</h3>
        {Object.keys(control._defaultValues.purchasepageSetting).map((key) => (
          <label key={key}>
            <input
              type="checkbox"
              {...register(`purchasepageSetting.${key}`)}
            />
            {key}
          </label>
        ))}
      </div>

      <div>
        <h3>Purchase Invoice Settings</h3>
        {Object.keys(control._defaultValues.PurchaseInvoiceSetting).map(
          (key) => (
            <label key={key}>
              <input
                type="checkbox"
                {...register(`PurchaseInvoiceSetting.${key}`)}
              />
              {key}
            </label>
          )
        )}
      </div>

      <div>
        <h3>Sales Entry Page Settings</h3>
        {Object.keys(control._defaultValues.SaleEntrypageSetting).map((key) => (
          <label key={key}>
            <input
              type="checkbox"
              {...register(`SaleEntrypageSetting.${key}`)}
            />
            {key}
          </label>
        ))}
      </div>

      <div>
        <h3>Sales Entry Receipt Settings</h3>
        {Object.keys(control._defaultValues.SaleEntryreceiptSetting).map(
          (key) => (
            <label key={key}>
              <input
                type="checkbox"
                {...register(`SaleEntryreceiptSetting.${key}`)}
              />
              {key}
            </label>
          )
        )}
      </div>

      <div>
        <h3>Estimate Form Settings</h3>
        {Object.keys(control._defaultValues.estimateForm).map((key) => (
          <label key={key}>
            <input type="checkbox" {...register(`estimateForm.${key}`)} />
            {key}
          </label>
        ))}
      </div>

      <div>
        <h3>Estimate Bill Settings</h3>
        {Object.keys(control._defaultValues.estimateBill).map((key) => (
          <label key={key}>
            <input type="checkbox" {...register(`estimateBill.${key}`)} />
            {key}
          </label>
        ))}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyFormComponent;

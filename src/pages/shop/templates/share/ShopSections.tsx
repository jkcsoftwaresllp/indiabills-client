// Sections.tsx

import React, { useState } from "react";
import RedeemIcon from '@mui/icons-material/Redeem';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import { CustomerAddress, Invoice, Order, Item, Customer, Discount, Payment } from "../../../../definitions/Types";
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import InputField from "../../../../components/FormComponent/InputField";
import DropdownBar from "../../../../components/FormComponent/DropdownBar";
import Dropdown from "../../../../components/FormComponent/Dropdown";
import MobileField from "../../../../components/FormComponent/MobileField";
import { extractCustomerName, getOption } from "../../../../utils/FormHelper";
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';

interface ActiveDiscounts {
  [key: number]: boolean;
}

interface CustomerSectionProps {
  isNewCustomer: boolean;
  setIsNewCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  newCustomer: Partial<Customer>;
  setNewCustomer: React.Dispatch<React.SetStateAction<Partial<Customer>>>;
  newShipping: Partial<CustomerAddress>;
  setNewShipping: React.Dispatch<React.SetStateAction<Partial<CustomerAddress>>>;
  customers: CustomerOption[];
  selectedCustomer: CustomerOption | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<CustomerOption | null>>;
  shippings: CustomerAddress[];
  selectedShipping: CustomerAddress | null;
  setSelectedShipping: React.Dispatch<React.SetStateAction<CustomerAddress | null>>;
  setOrderData: React.Dispatch<React.SetStateAction<Order>>;
  discounts: Discount[];
  discountType: string;
  products: Item[];
  setDiscountType: React.Dispatch<React.SetStateAction<string>>;
  manualDiscount: number;
  setManualDiscount: React.Dispatch<React.SetStateAction<number>>;
  initials: string;
  invoiceData: Invoice;
  setInvoiceData: React.Dispatch<React.SetStateAction<Invoice>>;
  activeDiscounts: ActiveDiscounts;
  setActiveDiscounts: React.Dispatch<React.SetStateAction<ActiveDiscounts>>;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({
  isNewCustomer,
  setIsNewCustomer,
  newCustomer,
  newShipping,
  setNewCustomer,
  setNewShipping,
  customers,
  selectedCustomer,
  selectedShipping,
  setSelectedCustomer,
  shippings,
  products,
  setSelectedShipping,
  setOrderData,
  discountType,
  setDiscountType,
  manualDiscount,
  setManualDiscount,
  initials,
  invoiceData,
  setInvoiceData,
  activeDiscounts,
  setActiveDiscounts,
}) => {

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleToggleDiscount = (itemId: number) => {
    setActiveDiscounts((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <main className={"w-full flex flex-col gap-4"}>
      <section id={"configurations"} className="flex flex-col text-slate-500 lg:w-full z-50 idms-control">
        <div id="switch" className="w-fit rounded-t-md flex relative">
          <span className={`h-full transition bg-rose-100 border-b-rose-500 border absolute ${isNewCustomer ? 'translate-x-20 w-20' : 'w-20 rounded-tl-md'}`}></span>
          <span onClick={() => setIsNewCustomer(false)} className={`transition p-2 z-10 text-center w-20 cursor-pointer ${!isNewCustomer ? 'text-rose-700 ' : 'text-slate-500'}`}>Existing</span>
          <span onClick={() => setIsNewCustomer(true)} className={`transition p-2 z-10 text-center w-20 cursor-pointer ${!isNewCustomer ? 'text-slate-500' : 'text-rose-700'}`}>New</span>
        </div>

        {!isNewCustomer ? (
          <form className="sm:flex sm:flex-col lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 gap-4 p-4 w-full shadow-inner">
            <DropdownBar label={"Select a customer"} data={customers} selectedData={selectedCustomer} setSelectedData={setSelectedCustomer} />
            <DropdownBar label={"Select Shipping Address"} data={shippings} selectedData={selectedShipping} setSelectedData={setSelectedShipping} />
          </form>
        ) : (
          <form className="flex flex-col gap-4 p-4 shadow-inner">
            <div className={"flex gap-4"}>
              <InputField type={"text"} name={"customerName"} placeholder={""} label={"Customer Name"} setData={setNewCustomer}/>
              <InputField optional type={"text"} name={"businessName"} placeholder={""} label={"Business Name"} setData={setNewCustomer}/>
              <InputField optional type={"text"} name={"gstin"} placeholder={""} label={"GSTIN"} setData={setNewCustomer}/>
            </div>
            <div className={"flex gap-4"}>
              <Dropdown name="gender" label="Gender" options={["Male", "Female", "Others", "Prefer not to say"]} selectedData={newCustomer} setValue={setNewCustomer}/>
              <MobileField label={"Mobile"} name={"mobile"} setData={setNewCustomer} data={newCustomer}/>
              <InputField type={"email"} name={"email"} placeholder={"example@domain.com"} label={"Email"} setData={setNewCustomer}/>
            </div>

            <div className="flex flex-col gap-4">
              <div className="lg:grid lg:grid-cols-2 md:grid md:grid-cols-2 sm:flex sm:flex-col gap-4">
                <Dropdown name="state" label="State" options={getOption('state')} selectedData={newCustomer} setValue={setNewShipping} />
                <InputField type={"text"} name={"city"} label={"City"} placeholder={""} setData={setNewShipping} />
                <InputField optional type={"text"} name={"landmark"} placeholder={""} label={"Landmark"} setData={setNewShipping} />
                <InputField type={"number"} name={"pinCode"} placeholder={"000000"} label={"Pincode"} setData={setNewShipping} />
              </div>
              <InputField type={"text"} placeholder={"office building, sector, etc."} name={"addressLine"} label={"Address Line"} setData={setNewShipping}/>
            </div>

          </form>
        )}
      </section>

      {/* Discount Section */}
      <section id={"discount"} className="flex flex-col w-full max-h-fit text-slate-500 idms-control">
      {/* Toggle Switch for Discount Type */}
      <div id="toggle-discount" className="w-fit rounded-t-md flex relative">
        <span className={`h-full transition bg-rose-100 border-b-rose-500 border absolute ${ discountType === "manual" ? "translate-x-40 w-40" : "w-40 rounded-tl-md" }`}></span>
        <span onClick={() => setDiscountType("automatic")} className={`transition p-2 z-10 text-center w-40 cursor-pointer ${ discountType !== "automatic" ? "text-slate-500" : "text-rose-700"}`}> Automatic </span>
        <span onClick={() => setDiscountType("manual")} className={`transition p-2 z-10 text-center w-40 cursor-pointer ${ discountType !== "manual" ? "text-slate-500" : "text-rose-700" }`}> Manual </span>
      </div>

    <div className="p-4 shadow-inner"> 
  {/* Manual Discount Input */}
  {discountType === "manual" && (
    <InputField
      type="number"
      placeholder={"Enter discount amount"}
      name="manualDiscount"
      label="How much discount?"
      value={manualDiscount}
      setData={setManualDiscount}
    />
  )}

  {/* Automatic Discounts List */}
  {discountType === "automatic" && products.filter(p => p.discountValue > 0 && p.offerName).length > 0 && (
    products.filter(p => p.discountValue > 0 && p.offerName).map((product) => (
      <div key={product.itemId} className="flex gap-4 p-2 items-center">
        <input
          type="checkbox"
          checked={activeDiscounts[product.itemId] !== false}
          onChange={() => handleToggleDiscount(product.itemId)}
        />
        <p> A discount of <span className="text-violet-500">{product.discountValue}%</span> on{" "}
          <span className="font-medium">{product.itemName}</span> has been applied under the offer{" "}
          <span className="capitalize font-medium">{product.offerName}</span>.
        </p>
      </div>
    ))
  )}
    </div> 
</section>

      <button type="button" className="m-4 text-slate-500 self-start" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
        {showAdvancedOptions ? <h2>Hide Advanced Options <ExpandLessRoundedIcon/> </h2> : <h2>View Advanced Options <ExpandMoreRoundedIcon /></h2>}
      </button>
      {showAdvancedOptions && (
        <section id={"moreOptions"} className="flex flex-col gap-6 p-6 w-full max-h-fit text-slate-500 idms-control">
          <div className="flex flex-col gap-5">
            <InputField startText={`${initials}-${new Date().getFullYear()}-`} type="number" placeholder={"XXXX"} name="invoiceNumber" label="Invoice Number" value={invoiceData.invoiceNumber} setData={setInvoiceData}/>
            <InputField type={"date"} name={"invoiceDate"} label={"Invoice Date"} setData={setInvoiceData} limitWidth={true} />
            <InputField type={"date"} name={"dueDate"} label={"Due Date"} setData={setInvoiceData} limitWidth={true} />
            <InputField type={"date"} name={"orderDate"} label={"Order Date"} setData={setOrderData} limitWidth={true} />
            <InputField type={"number"} name={"shippingCost"} placeholder={"₹"} label={"Shipping Cost"} setData={setOrderData} limitWidth={true} />
            <InputField type={"date"} name={"shippingDate"} label={"Shipping Date"} setData={setOrderData} limitWidth={true} />
          </div>
        </section>
      )}
    </main>
  );
};

interface OrderDetailsProps {
  subtotal: number;
  taxes: number;
  discountValue: number;
  totalCost: number;
  profitOrLoss: number;
  orderData: Order;
  payMethods: string[];
  payOffline: boolean;
  setPayOffline: React.Dispatch<React.SetStateAction<boolean>>;
  paymentMethod: string;
  payment: Payment;
  setPayment: React.Dispatch<React.SetStateAction<Payment>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  selectedCustomer: CustomerOption | null;
  selectedShipping: CustomerAddress | null;
  newCustomer: Partial<Customer>;
  newShipping: Partial<CustomerAddress>;
  products: Item[];
  discountType: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  subtotal,
  taxes,
  discountValue,
  totalCost,
  profitOrLoss,
  orderData,
  payMethods,
  payOffline,
  setPayOffline,
  paymentMethod,
  setPaymentMethod,
  payment,
  setPayment,
  selectedCustomer,
  selectedShipping,
  newCustomer,
  newShipping,
}) => {
  const [upiId, setUpiId] = useState<string>("");
  const [showCardModal, setShowCardModal] = useState<boolean>(false);

  const handleOpenCardModal = () => setShowCardModal(true);
  const handleCloseCardModal = () => setShowCardModal(false);

  const customerName = selectedCustomer ? selectedCustomer.name : newCustomer.customerName;
  const businessName = selectedCustomer ? selectedCustomer.businessName : newCustomer.businessName;
  const gender = selectedCustomer ? selectedCustomer.gender : newCustomer.gender;
  const addressLine = selectedShipping ? selectedShipping.addressLine : newShipping.addressLine;
  const city = selectedShipping ? selectedShipping.city : newShipping.city;
  const district = selectedShipping ? selectedShipping.district : newShipping.district;
  const state = selectedShipping ? selectedShipping.state : newShipping.state;
  const pinCode = selectedShipping ? selectedShipping.pinCode : newShipping.pinCode;

  return (
      <main className={"lg:flex lg:flex-row md:flex md:flex-row sm:flex sm:flex-col gap-2 w-full text-slate-500"}>
        <section id={"pricing details"}
                 className="flex flex-col md:min-w-4/5 lg:w-3/5 sm:min-3/5 gap-2 border-l p-6 idms-control">
          <div className={"flex gap-4 items-center capitalize"}>
            <h1 className="text-black text-2xl font-semibold">₹{totalCost.toFixed(2)}</h1>
            <h1 className={`text-lg font-regular ${profitOrLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>{profitOrLoss >= 0 ? `+${profitOrLoss.toFixed(2)}` : `-${Math.abs(profitOrLoss.toFixed(2))}`}</h1>
          </div>
          <div className={"grid grid-cols-2 border-t p-2 gap-2 capitalize"}>
            <div className="flex flex-col break-keep font-medium text-nowrap gap-1">
              <p> subtotal </p>
              <p> taxes </p>
              <p> Shipping Cost </p>
              <p> Discount Applied </p>
            </div>
            <div className="flex text-right flex-col gap-1">
              <p> {subtotal.toFixed(2)} </p>
              <p> {taxes.toFixed(2)} </p>
              <p> {Number(orderData.shippingCost).toFixed(2)} </p>
              <p> {Number(discountValue || '0').toFixed(2)} </p>
            </div>
          </div>
        </section>
        {selectedCustomer && (
        <section id={"customer-details"} className="flex flex-col w-2/5 gap-2 border-l p-6 idms-control">
                <div className={"flex flex-col gap-4 items-center capitalize border-b"}>
                  <h1 className="text-black text-2xl font-semibold">
                    <span>{gender ? gender : ''}</span>
                    {extractCustomerName(customerName)}
                  </h1>
                  <h3>{businessName}</h3>
                </div>
                <div className={"flex flex-col capitalize text-center"}>
                  {addressLine && <p>{addressLine},</p>}
                  {city && <p>{city},</p>}
                  {district && <p>{district}</p>}
                  {state && <p>{state}</p>}
                  {pinCode && <p>{pinCode}</p>}
                </div>
        </section>
          )}
      </main>
  );
};

import React, { useState } from "react";
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import InputField from "../../../../components/FormComponent/InputField";
import DropdownBar from "../../../../components/FormComponent/DropdownBar";
import Dropdown from "../../../../components/FormComponent/Dropdown";
import MobileField from "../../../../components/FormComponent/MobileField";
import { extractCustomerName, getOption } from "../../../../utils/FormHelper";
import styles from "./ShopSection.module.css";

export const ShopSection = ({
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

  const handleToggleDiscount = (itemId) => {
    setActiveDiscounts((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <main className={styles.main}>
      <section id={"configurations"} className={styles.configurations}>
        <div id="switch" className={styles.switch}>
          <span
            className={`${styles.switchSpan} ${
              isNewCustomer ? styles.switchSpanNew : styles.switchSpanExisting
            }`}
          ></span>
          <span
            onClick={() => setIsNewCustomer(false)}
            className={`${styles.switchText} ${
              !isNewCustomer ? styles.textRose700 : styles.textSlate500
            }`}
          >
            Existing
          </span>
          <span
            onClick={() => setIsNewCustomer(true)}
            className={`${styles.switchText} ${
              isNewCustomer ? styles.textRose700 : styles.textSlate500
            }`}
          >
            New
          </span>
        </div>

        {!isNewCustomer ? (
          <form className={styles.formExisting}>
            <DropdownBar
              label={"Select a customer"}
              data={customers}
              selectedData={selectedCustomer}
              setSelectedData={setSelectedCustomer}
            />
            <DropdownBar
              label={"Select Shipping Address"}
              data={shippings}
              selectedData={selectedShipping}
              setSelectedData={setSelectedShipping}
            />
          </form>
        ) : (
          <form className={styles.formNew}>
            <div className={styles.flexRowGap4}>
              <InputField
                type={"text"}
                name={"customerName"}
                placeholder={""}
                label={"Customer Name"}
                setData={setNewCustomer}
              />
              <InputField
                optional
                type={"text"}
                name={"businessName"}
                placeholder={""}
                label={"Business Name"}
                setData={setNewCustomer}
              />
              <InputField
                optional
                type={"text"}
                name={"gstin"}
                placeholder={""}
                label={"GSTIN"}
                setData={setNewCustomer}
              />
            </div>
            <div className={styles.flexRowGap4}>
              <Dropdown
                name="gender"
                label="Gender"
                options={["Male", "Female", "Others", "Prefer not to say"]}
                selectedData={newCustomer}
                setValue={setNewCustomer}
              />
              <MobileField
                label={"Mobile"}
                name={"mobile"}
                setData={setNewCustomer}
                data={newCustomer}
              />
              <InputField
                type={"email"}
                name={"email"}
                placeholder={"example@domain.com"}
                label={"Email"}
                setData={setNewCustomer}
              />
            </div>

            <div className={styles.flexColGap4}>
              <div className={styles.grid2Cols}>
                <Dropdown
                  name="state"
                  label="State"
                  options={getOption("state")}
                  selectedData={newCustomer}
                  setValue={setNewShipping}
                />
                <InputField
                  type={"text"}
                  name={"city"}
                  label={"City"}
                  placeholder={""}
                  setData={setNewShipping}
                />
                <InputField
                  optional
                  type={"text"}
                  name={"landmark"}
                  placeholder={""}
                  label={"Landmark"}
                  setData={setNewShipping}
                />
                <InputField
                  type={"number"}
                  name={"pinCode"}
                  placeholder={"000000"}
                  label={"Pincode"}
                  setData={setNewShipping}
                />
              </div>
              <InputField
                type={"text"}
                placeholder={"office building, sector, etc."}
                name={"addressLine"}
                label={"Address Line"}
                setData={setNewShipping}
              />
            </div>
          </form>
        )}
      </section>

      <section id={"discount"} className={`${styles.flexColGap4} ${styles.maxHeightFit} ${styles.textSlate500} idms-control`}>
        <div id="toggle-discount" className={styles.toggleDiscount}>
          <span
            className={`${styles.toggleSpan} ${
              discountType === "manual"
                ? styles.toggleSpanManual
                : styles.toggleSpanAutomatic
            }`}
          ></span>
          <span
            onClick={() => setDiscountType("automatic")}
            className={`${styles.toggleText} ${
              discountType !== "automatic"
                ? styles.textSlate500
                : styles.textRose700
            }`}
          >
            Automatic
          </span>
          <span
            onClick={() => setDiscountType("manual")}
            className={`${styles.toggleText} ${
              discountType !== "manual"
                ? styles.textSlate500
                : styles.textRose700
            }`}
          >
            Manual
          </span>
        </div>

        <div className={styles.p4ShadowInner}>
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

          {discountType === "automatic" &&
            products.filter((p) => p.discountValue > 0 && p.offerName).length >
              0 &&
            products
              .filter((p) => p.discountValue > 0 && p.offerName)
              .map((product) => (
                <div
                  key={product.itemId}
                  className={styles.flexGap4P2ItemsCenter}
                >
                  <input
                    type="checkbox"
                    checked={activeDiscounts[product.itemId] !== false}
                    onChange={() => handleToggleDiscount(product.itemId)}
                  />
                  <p>
                    A discount of{" "}
                    <span className={styles.textViolet500}>
                      {product.discountValue}%
                    </span>{" "}
                    on <span className={styles.fontMedium}>{product.itemName}</span>{" "}
                    has been applied under the offer{" "}
                    <span
                      className={`${styles.capitalize} ${styles.fontMedium}`}
                    >
                      {product.offerName}
                    </span>
                    .
                  </p>
                </div>
              ))}
        </div>
      </section>

      <button
        type="button"
        className={`${styles.m4} ${styles.textSlate500} self-start`}
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        {showAdvancedOptions ? (
          <h2>
            Hide Advanced Options <ExpandLessRoundedIcon />
          </h2>
        ) : (
          <h2>
            View Advanced Options <ExpandMoreRoundedIcon />
          </h2>
        )}
      </button>
      {showAdvancedOptions && (
        <section
          id={"moreOptions"}
          className={`${styles.flexColGap4} ${styles.p6} ${styles.maxHeightFit} ${styles.textSlate500} idms-control`}
        >
          <div className={styles.flexColGap4}>
            <InputField
              startText={`${initials}-${new Date().getFullYear()}-`}
              type="number"
              placeholder={"XXXX"}
              name="invoiceNumber"
              label="Invoice Number"
              value={invoiceData.invoiceNumber}
              setData={setInvoiceData}
            />
            <InputField
              type={"date"}
              name={"invoiceDate"}
              label={"Invoice Date"}
              setData={setInvoiceData}
              limitWidth={true}
            />
            <InputField
              type={"date"}
              name={"dueDate"}
              label={"Due Date"}
              setData={setInvoiceData}
              limitWidth={true}
            />
            <InputField
              type={"date"}
              name={"orderDate"}
              label={"Order Date"}
              setData={setOrderData}
              limitWidth={true}
            />
            <InputField
              type={"number"}
              name={"shippingCost"}
              placeholder={"₹"}
              label={"Shipping Cost"}
              setData={setOrderData}
              limitWidth={true}
            />
            <InputField
              type={"date"}
              name={"shippingDate"}
              label={"Shipping Date"}
              setData={setOrderData}
              limitWidth={true}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export const OrderDetails = ({
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
  const customerName = selectedCustomer
    ? selectedCustomer.name
    : newCustomer.customerName;
  const businessName = selectedCustomer
    ? selectedCustomer.businessName
    : newCustomer.businessName;
  const gender = selectedCustomer ? selectedCustomer.gender : newCustomer.gender;
  const addressLine = selectedShipping
    ? selectedShipping.addressLine
    : newShipping.addressLine;
  const city = selectedShipping ? selectedShipping.city : newShipping.city;
  const district = selectedShipping
    ? selectedShipping.district
    : newShipping.district;
  const state = selectedShipping ? selectedShipping.state : newShipping.state;
  const pinCode = selectedShipping ? selectedShipping.pinCode : newShipping.pinCode;

  return (
    <main className={`${styles.flexRowGap2WFullTextSlate500}`}>
      <section
        id={"pricing details"}
        className={`${styles.flexColGap2BorderLP6} ${styles.borderL} ${styles.p6} idms-control`}
        style={{ minWidth: "80%" }}
      >
        <div className={`${styles.flexRowGap2ItemsCenterCapitalize}`}>
          <h1 className={`${styles.textBlack} ${styles.text2xl} ${styles.fontSemibold}`}>
            ₹{totalCost.toFixed(2)}
          </h1>
          <h1
            className={`${styles.textLg} ${styles.fontRegular} ${
              profitOrLoss >= 0 ? styles.textGreen500 : styles.textRed500
            }`}
          >
            {profitOrLoss >= 0
              ? `+${profitOrLoss.toFixed(2)}`
              : `-${Math.abs(profitOrLoss.toFixed(2))}`}
          </h1>
        </div>
        <div className={styles.gridCols2BorderTP2Gap2}>
          <div className={styles.flexColBreakKeepFontMediumGap1}>
            <p>subtotal</p>
            <p>taxes</p>
            <p>Shipping Cost</p>
            <p>Discount Applied</p>
          </div>
          <div className={styles.textRightFlexColGap1}>
            <p>{subtotal.toFixed(2)}</p>
            <p>{taxes.toFixed(2)}</p>
            <p>{orderData.shippingCost}</p>
            <p>{discountValue.toFixed(2)}</p>
          </div>
        </div>

        <div className={styles.flexColBreakKeepFontMediumGap1}>
          <h2 className={`${styles.textCenter} ${styles.fontMedium}`}>
            Customer Details
          </h2>
          <p>{customerName}</p>
          <p>{businessName}</p>
          <p>{gender}</p>
          <p>
            {addressLine}, {city}, {district}, {state}, {pinCode}
          </p>
        </div>
      </section>

      <section
        id={"payment"}
        className={`${styles.flexColGap2BorderLP6} ${styles.borderL} ${styles.p6} idms-control`}
      >
        <h2 className={`${styles.textCenter} ${styles.fontMedium}`}>Payment</h2>
        <div>
          <Dropdown
            label={"Payment Method"}
            name={"paymentMethod"}
            options={payMethods}
            selectedData={paymentMethod}
            setValue={setPaymentMethod}
          />
          <Dropdown
            label={"Offline Payment Method"}
            name={"payOffline"}
            options={payOffline}
            selectedData={payOffline}
            setValue={setPayOffline}
          />
          <InputField
            label={"Payment"}
            type={"number"}
            placeholder={"₹"}
            name={"payment"}
            value={payment}
            setData={setPayment}
          />
        </div>
      </section>
    </main>
  );
};
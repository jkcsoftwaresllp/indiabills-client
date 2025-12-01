import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import { getOption, renameAndOptimize, validateForm } from "../../utils/FormHelper";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { createCustomer } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/FormComponent/ImageUpload";
import MobileField from "../../components/FormComponent/MobileField";
import Timeline from "../../components/FormComponent/Timeline";

const AddCustomers = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [image, setImage] = useState();
  const [formData, setFormData] = useState({});
  const [page, setPage] = useState(1);

  const backPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const validateSlideFields = useCallback(() => {
    if (page === 1) {
      // Validate first slide (Basic Information)
      const requiredFields = ["first_name", "last_name", "email", "phone", "password", "confirm_password"];
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === "") {
          const fieldLabel = field.replace(/_/g, " ").charAt(0).toUpperCase() + field.replace(/_/g, " ").slice(1);
          errorPopup(`${fieldLabel} is required`);
          return false;
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errorPopup("Invalid email format");
        return false;
      }

      // Validate phone format
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
        errorPopup("Invalid phone number format");
        return false;
      }

      // Validate password match
      if (formData.password !== formData.confirm_password) {
        errorPopup("Password and confirm password do not match");
        return false;
      }

      return true;
    }
    return true;
  }, [page, formData, errorPopup]);

  const nextPage = useCallback(() => {
    if (page < 2) {
      if (validateSlideFields()) {
        setPage(page + 1);
      }
    }
  }, [page, validateSlideFields]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const submit = async () => {
    if (!validateForm("customers", formData)) {
      errorPopup(`Complete all required fields before submitting!`);
      return;
    }

    // Business type conditional validation
    if (formData.customer_type === "business") {
      if (!formData.business_name || formData.business_name.trim() === "") {
        errorPopup("Business Name is required for business customers");
        return;
      }
      if (!formData.gstin || formData.gstin.trim() === "") {
        errorPopup("GSTIN is required for business customers");
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errorPopup("Invalid email format");
      return;
    }

    // Validate phone format
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      errorPopup("Invalid phone number format");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirm_password) {
      errorPopup("Password and confirm password do not match");
      return;
    }

    let avatar = "";
    if (image) {
      const ImageData = await renameAndOptimize(formData.first_name, image);
      const response = await uploadImg(ImageData.image, true);
      if (response !== 200) {
        console.error("Failed to upload the image");
        return;
      }
      avatar = ImageData.name;
    }

    const finalData = {
      ...formData,
      avatar: avatar,
    };

    try {
      const status = await createCustomer(finalData);
      if (status === 201 || status === 200) {
        successPopup("Customer registered successfully!");
        // Add a small delay to ensure server processes the request
        setTimeout(() => {
          navigate("/customers");
        }, 500);
      } else {
        errorPopup("Failed to register the customer");
      }
    } catch (error) {
      const errorMessage = error?.message || "Failed to register the customer";
      errorPopup(errorMessage);
    }
  };

  const steps = ["Basic Information", "Business Details"];

  return (
    <PageAnimate>
      <div className={"h-full flex flex-col gap-12 justify-center items-center"}>
        <button
          className={"self-start flex items-center"}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Go back
        </button>

        <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
          register a new<span className={"text-rose-400"}> customer</span> :)
        </h1>

        <Timeline steps={steps} currentStep={page} />

        <div>
          <div className={"h-full w-full flex justify-center"}>
            <main>
              {page === 1 && (
                <BasicPage
                  setImage={setImage}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
              {page === 2 && (
                <BusinessPage
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
            </main>

            <div className={"p-2 flex flex-col gap-4"}>
              {page === 2 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-submit"
                  onClick={submit}
                >
                  <FiCheckCircle />
                </button>
              )}
              {page < 2 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-nav"
                  onClick={nextPage}
                >
                  <FiArrowRight />
                </button>
              )}
              {page >= 2 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-nav"
                  onClick={backPage}
                >
                  <FiArrowLeft />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default AddCustomers;

const BasicPage = React.memo(({ formData, handleChange, setFormData, setImage }) => {
   return (
     <MultiPageAnimate>
       <div className="p-8 flex flex-col items-center gap-8 idms-bg">
         <main className="grid grid-cols-2 gap-6">
           <InputBox
             name="first_name"
             type="string"
             label="First Name"
             placeholder={""}
             value={formData.first_name}
             onChange={handleChange}
             required
           />
           <InputBox
             name="last_name"
             type="string"
             label="Last Name"
             placeholder={""}
             value={formData.last_name}
             onChange={handleChange}
             required
           />
           <InputBox
             name="middle_name"
             type="string"
             label="Middle Name"
             placeholder={""}
             value={formData.middle_name}
             onChange={handleChange}
           />
           <ImageUpload setImage={setImage} />
           <MobileField
             label={"Phone *"}
             name={"phone"}
             setData={setFormData}
             data={formData}
             required
           />
           <InputBox
             name="email"
             type="email"
             label="Email"
             placeholder={"example@domain.com"}
             value={formData.email}
             onChange={handleChange}
             required
           />
           <Dropdown
             name={"gender"}
             label="Gender"
             options={["male", "female", "other", "prefer_not_to_say"]}
             selectedData={formData}
             setValue={setFormData}
           />
           <InputBox
             name="password"
             type="password"
             label="Password"
             placeholder={"Password"}
             value={formData.password}
             onChange={handleChange}
             required
           />
           <InputBox
             name="confirm_password"
             type="password"
             label="Confirm Password"
             placeholder={"Confirm Password"}
             value={formData.confirm_password}
             onChange={handleChange}
             required
           />
        </main>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = "BasicPage";

const BusinessPage = React.memo(({ formData, handleChange, setFormData }) => {
   const isBusinessCustomer = formData.customer_type === "business";

   return (
     <MultiPageAnimate>
       <div className="p-8 flex flex-col items-center gap-8 idms-bg">
         <main className="grid grid-cols-2 gap-6">
           <Dropdown
             name={"customer_type"}
             label="Customer Type *"
             options={["individual", "business"]}
             selectedData={formData}
             setValue={setFormData}
             required
           />
          <InputBox
            name="business_name"
            type="string"
            label={`Business Name${isBusinessCustomer ? " *" : ""}`}
            placeholder={"Business Name"}
            value={formData.business_name}
            onChange={handleChange}
            required={isBusinessCustomer}
          />
          <InputBox
            name="gstin"
            type="text"
            label={`GSTIN${isBusinessCustomer ? " *" : ""}`}
            placeholder={"GSTIN"}
            value={formData.gstin}
            onChange={handleChange}
            required={isBusinessCustomer}
          />
          <InputBox
            name="fssai_number"
            type="text"
            label="FSSAI Number"
            placeholder={"FSSAI Number"}
            value={formData.fssai_number}
            onChange={handleChange}
          />
          <InputBox
            name="pan_number"
            type="text"
            label="PAN Number"
            placeholder={"PAN Number"}
            value={formData.pan_number}
            onChange={handleChange}
          />
          <InputBox
            name="aadhar_number"
            type="text"
            label="Aadhar Number"
            placeholder={"Aadhar Number"}
            value={formData.aadhar_number}
            onChange={handleChange}
          />
          <InputBox
            name="date_of_birth"
            type="date"
            label="Date of Birth"
            placeholder={""}
            value={formData.date_of_birth}
            onChange={handleChange}
          />
          <InputBox
            name="credit_limit"
            type="number"
            label="Credit Limit"
            placeholder={"0"}
            value={formData.credit_limit}
            onChange={handleChange}
          />
          <InputBox
            name="loyalty_points"
            type="number"
            label="Loyalty Points"
            placeholder={"0"}
            value={formData.loyalty_points}
            onChange={handleChange}
          />
        </main>
      </div>
    </MultiPageAnimate>
  );
});

BusinessPage.displayName = "BusinessPage";

const AddressPage = React.memo(({ formData, handleChange, setFormData }) => {
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="flex flex-col gap-6">
          <InputBox
            required
            name="addressType"
            type="string"
            label="Address Type"
            placeholder={""}
            value={formData.addressType}
            onChange={handleChange}
          />
          <InputBox
            multiline={true}
            required
            name="addressLine"
            type="string"
            label="Address Line"
            placeholder={"Plot, Street, Town"}
            value={formData.addressLine}
            onChange={handleChange}
          />
          <div className={"grid grid-cols-2 gap-4"}>
            <InputBox
              name="landmark"
              type="string"
              label="Landmark"
              placeholder={""}
              value={formData.landmark}
              onChange={handleChange}
            />
            <InputBox
              required
              name="city"
              type="string"
              label="City"
              placeholder={""}
              value={formData.city}
              onChange={handleChange}
            />
            <Dropdown
              required
              name={"state"}
              label="State"
              options={getOption("state")}
              selectedData={formData}
              setValue={setFormData}
            />
            <InputBox
              required
              name="pinCode"
              type="string"
              label="Pin Code"
              placeholder={"00000"}
              value={formData.pinCode}
              onChange={handleChange}
            />
          </div>
        </main>
      </div>
    </MultiPageAnimate>
  );
});

AddressPage.displayName = "AddressPage";

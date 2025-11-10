import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { createTransportPartner } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { getOption } from "../../utils/FormHelper";

const AddTransport = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    gstNumber: "",
    panNumber: "",
    vehicleDetails: "", // Comma-separated or multiline input
    baseRate: "",
    ratePerKm: ""
  });

  const [page, setPage] = useState(1);

  const backPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const nextPage = useCallback(() => {
    if (page < 3) setPage(page + 1);
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  /** 🧩 Build backend payload structure */
  const buildPayload = () => {
    const vehiclesArray =
      formData.vehicleDetails
        ?.split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0) || [];

    return {
      name: formData.name,
      business_name: formData.businessName,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      alternate_phone: formData.alternatePhone,
      address_line: formData.addressLine,
      city: formData.city,
      state: formData.state,
      pin_code: formData.pinCode,
      gst_number: formData.gstNumber,
      pan_number: formData.panNumber,
      vehicle_details: { vehicles: vehiclesArray },
      base_rate: Number(formData.baseRate) || 0,
      rate_per_km: Number(formData.ratePerKm) || 0
    };
  };

  const submit = async () => {
    try {
      const payload = buildPayload();
      const status = await createTransportPartner(payload);
      if (status === 200 || status === 201) {
        successPopup("Transport registered successfully!");
        navigate("/transport");
      } else {
        errorPopup("Failed to register the transport :(");
      }
    } catch (err) {
      errorPopup("An unexpected error occurred!");
      console.error(err);
    }
  };

  const steps = ["Basic Info", "Address Details", "Legal Details"];

  return (
    <PageAnimate>
      <div className="h-full flex flex-col gap-12 justify-center items-center">
        <button
          className="self-start flex items-center"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Go back
        </button>

        <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
          register a new<span className="text-rose-400"> transport</span> :)
        </h1>

        <Timeline steps={steps} currentStep={page} />

        <div className="h-full w-full flex justify-center">
          <main>
            {page === 1 && (
              <BasicPage formData={formData} handleChange={handleChange} />
            )}
            {page === 2 && (
              <AddressPage
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
            {page === 3 && (
              <LegalPage formData={formData} handleChange={handleChange} />
            )}
          </main>

          <div className="p-2 flex flex-col gap-4">
            {page === 3 && (
              <button
                className="p-3 flex-grow shadow-xl form-button-submit"
                onClick={submit}
              >
                <FiCheckCircle />
              </button>
            )}
            {page < 3 && (
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
    </PageAnimate>
  );
};

export default AddTransport;

/* --------------------- Subpages ---------------------- */

const BasicPage = React.memo(({ formData, handleChange }) => (
  <MultiPageAnimate>
    <div className="p-8 flex flex-col items-center gap-8 idms-bg">
      <main className="grid grid-cols-2 gap-6">
        <InputBox
          name="name"
          label="Transport Name"
          placeholder="Transport Name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputBox
          name="businessName"
          label="Business Name"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
        />
        <InputBox
          name="contactPerson"
          label="Contact Person"
          placeholder="Contact Person"
          value={formData.contactPerson}
          onChange={handleChange}
        />
        <InputBox
          name="email"
          label="Email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputBox
          name="phone"
          label="Phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputBox
          name="alternatePhone"
          label="Alternate Phone"
          placeholder="Alternate Phone"
          value={formData.alternatePhone}
          onChange={handleChange}
        />
        <InputBox
          name="vehicleDetails"
          label="Vehicle Numbers (comma separated)"
          placeholder="KA01AB1234, KA02CD5678"
          value={formData.vehicleDetails}
          onChange={handleChange}
        />
      </main>
    </div>
  </MultiPageAnimate>
));

const AddressPage = React.memo(({ formData, handleChange, setFormData }) => (
  <MultiPageAnimate>
    <div className="p-8 flex flex-col items-center gap-8 idms-bg">
      <main className="grid grid-cols-2 gap-6">
        <InputBox
          name="addressLine"
          label="Address Line"
          placeholder="Address Line"
          value={formData.addressLine}
          onChange={handleChange}
        />
        <InputBox
          name="city"
          label="City"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <Dropdown
          name="state"
          label="State"
          options={getOption("state")}
          selectedData={formData.state}
          setValue={setFormData}
        />
        <InputBox
          name="pinCode"
          label="Pin Code"
          placeholder="123456"
          value={formData.pinCode}
          onChange={handleChange}
        />
        <InputBox
          name="baseRate"
          type="number"
          label="Base Rate (₹)"
          placeholder="0"
          value={formData.baseRate}
          onChange={handleChange}
        />
        <InputBox
          name="ratePerKm"
          type="number"
          label="Rate Per KM (₹)"
          placeholder="0"
          value={formData.ratePerKm}
          onChange={handleChange}
        />
      </main>
    </div>
  </MultiPageAnimate>
));

const LegalPage = React.memo(({ formData, handleChange }) => (
  <MultiPageAnimate>
    <div className="p-8 flex flex-col items-center gap-8 idms-bg">
      <main className="grid grid-cols-2 gap-6">
        <InputBox
          name="gstNumber"
          label="GST Number"
          placeholder="29ABCDE1234F1Z5"
          value={formData.gstNumber}
          onChange={handleChange}
        />
        <InputBox
          name="panNumber"
          label="PAN Number"
          placeholder="ABCDE1234F"
          value={formData.panNumber}
          onChange={handleChange}
        />
      </main>
    </div>
  </MultiPageAnimate>
));

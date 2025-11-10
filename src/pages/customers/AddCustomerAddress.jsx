import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { addRow } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { getOption, validateForm } from "../../utils/FormHelper";

const AddCustomerAddress = () => {
  const customerId = useParams();

  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressType: "",
    addressLine: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [page, setPage] = useState(1);

  const backPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const submit = async () => {
    if (!validateForm("customerAddresses", formData)) {
      errorPopup(`Complete all required fields before submitting!`);
      return;
    }

    try {
      const response = await addRow(`/ops/sales/portal/customer/profile/addresses`, formData);
      if (response === 200 || response === 201) {
        successPopup("Customer address added successfully!");
        navigate(`/customers/${customerId.customerId}`);
      } else {
        throw new Error('New API failed');
      }
    } catch (error) {
      console.error('Error with new API, falling back to old API:', error);
    }
  };

  const steps = ["Address Details"];

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
          add a new<span className={"text-rose-400"}> address</span> :)
        </h1>

        <Timeline steps={steps} currentStep={page} />

        <div>
          <div className={"h-full w-full flex justify-center"}>
            <main>
              {page === 1 && (
                <AddressPage
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
            </main>

            <div className={"p-2 flex flex-col gap-4"}>
              {page === 1 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-submit"
                  onClick={submit}
                >
                  <FiCheckCircle />
                </button>
              )}
              {page >= 1 && (
                <button
                  className="p-3 flex-grow shadow-xl cursor-not-allowed form-button-nav"
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

export default AddCustomerAddress;

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
              selectedData={formData.state}
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

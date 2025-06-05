import React, { useState, useCallback } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addRow } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { getOption, validateForm } from "../../utils/FormHelper";
import styles from './styles/AddCustomerAddress.module.css';

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

    addRow("/customers/address/add", { ...formData, ...customerId }).then(
      (status) => {
        if (status === 201 || status === 200) {
          successPopup("Customer address added successfully!");
          navigate(`/customers/${customerId.customerId}`);
        } else {
          errorPopup("Failed to add the customer address :(");
        }
      }
    );
  };

  const steps = ["Address Details"];

  return (
    <PageAnimate>
      <div className={styles.wrapper}>
        <button className={styles.goBackButton} onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon /> Go back
        </button>

        <h1 className={styles.heading}>
          add a new <span className={styles.highlight}>address</span> :)
        </h1>

        <Timeline steps={steps} currentStep={page} />

        <div className={styles.formWrapper}>
          <div className={styles.formContent}>
            <main>
              {page === 1 && (
                <AddressPage
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
            </main>

            <div className={styles.buttonGroup}>
              {page === 1 && (
                <button className={styles.submitButton} onClick={submit}>
                  <CheckCircleIcon />
                </button>
              )}
              {page >= 1 && (
                <button className={styles.backButton} onClick={backPage}>
                  <ArrowBackIosNewIcon />
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

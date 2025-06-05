import React, { useState, useCallback } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addRow } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { SupplierMetadata } from "../../definitions/Metadata";
import { getOption, initializeFormData } from "../../utils/FormHelper";
import styles from "./styles/AddSuppliers.module.css";

const AddSuppliers = () => {
	const { successPopup, errorPopup } = useStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState(initializeFormData(SupplierMetadata));
	const [page, setPage] = useState(1);

	const backPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const nextPage = useCallback(() => {
		if (page < 3) {
			setPage(page + 1);
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
		addRow("/suppliers/add", formData).then((status) => {
			if (status === 201 || status === 200) {
				successPopup("Supplier registered successfully!");
				navigate('/suppliers');
			} else {
				errorPopup("Failed to register the supplier :(");
			}
		});
	};

	const steps = ["Basic Info", "Address Details", "Other Details"];

	return (
  <PageAnimate>
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowBackIosNewIcon /> Go back
      </button>

      <h1 className={styles.title}>
        register a new
        <span className={styles.highlight}> supplier</span> :)
      </h1>

      <Timeline steps={steps} currentStep={page} />

      <div className={styles.innerWrapper}>
        <main>
          {page === 1 && (
            <BasicPage
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          )}
          {page === 2 && (
            <AddressPage
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          )}
          {page === 3 && (
            <OtherPage
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          )}
        </main>

        <div className={styles.actions}>
          {page === 3 && (
            <button className={`${styles.button} form-button-submit`} onClick={submit}>
              <CheckCircleIcon />
            </button>
          )}
          {page < 3 && (
            <button className={`${styles.button} form-button-nav`} onClick={nextPage}>
              <ArrowForwardIosIcon />
            </button>
          )}
          {page >= 2 && (
            <button className={`${styles.button} form-button-nav`} onClick={backPage}>
              <ArrowBackIosNewIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  </PageAnimate>
);
};

export default AddSuppliers;

const BasicPage = React.memo(({ formData, handleChange }) => {
	return (
  <MultiPageAnimate>
    <div className={`${styles.container2} ${idms-bg}`}>
      <main className={styles.grid}>
        <InputBox
          name="supplierName"
          type="string"
          label="Supplier Name"
          placeholder="__________"
          value={formData.supplierName}
          onChange={handleChange}
        />
        <InputBox
          name="businessName"
          type="string"
          label="Business Name"
          placeholder="__________"
          value={formData.businessName}
          onChange={handleChange}
        />
        <InputBox
          name="email"
          type="string"
          label="Email"
          placeholder="example@domain.com"
          value={formData.email}
          onChange={handleChange}
        />
        <InputBox
          name="mobileNumber"
          type="number"
          label="Mobile Number"
          placeholder="XXXXXX"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
        <InputBox
          name="alternateMobileNumber"
          type="number"
          label="Alternate Mobile Number"
          placeholder="XXXXXX"
          value={formData.alternateMobileNumber}
          onChange={handleChange}
        />
      </main>
    </div>
  </MultiPageAnimate>
);
});

BasicPage.displayName = 'BasicPage';

const AddressPage = React.memo(({ formData, handleChange, setFormData }) => {
	return (
		<MultiPageAnimate>
    <div className={`${styles.container2} idms-bg`}>
      <main className={styles.grid}>
        <InputBox
          name="addressLine1"
          type="string"
          label="Address Line 1"
          placeholder="__________"
          value={formData.addressLine1}
          onChange={handleChange}
        />
        <InputBox
          name="addressLine2"
          type="string"
          label="Address Line 2"
          placeholder="__________"
          value={formData.addressLine2}
          onChange={handleChange}
        />
        <InputBox
          name="city"
          type="string"
          label="City"
          placeholder="__________"
          value={formData.city}
          onChange={handleChange}
        />
        <Dropdown
          name="state"
          label="State"
          options={getOption("state")}
          selectedData={formData}
          setValue={setFormData}
        />
        <InputBox
          name="pinCode"
          type="number"
          label="Pin Code"
          placeholder="123456"
          value={formData.pinCode}
          onChange={handleChange}
        />
      </main>
    </div>
  </MultiPageAnimate>
	);
});

AddressPage.displayName = 'AddressPage';

const OtherPage = React.memo(({ formData, handleChange }) => {
	return (
		<MultiPageAnimate>
    <div className={`${styles.container2} idms-bg`}>
      <main className={styles.grid}>
        <InputBox
          name="beneficiaryName"
          type="string"
          label="Beneficiary Name"
          placeholder="__________"
          value={formData.beneficiaryName}
          onChange={handleChange}
        />
        <InputBox
          name="accountNumber"
          type="number"
          label="Account Number"
          placeholder="__________"
          value={formData.accountNumber}
          onChange={handleChange}
        />
        <InputBox
          name="ifscCode"
          type="string"
          label="IFSC Code"
          placeholder="__________"
          value={formData.ifscCode}
          onChange={handleChange}
        />
        <InputBox
          name="virtualPaymentAddress"
          type="string"
          label="Virtual Payment Address"
          placeholder="__________"
          value={formData.virtualPaymentAddress}
          onChange={handleChange}
        />
        <InputBox
          name="remarks"
          type="string"
          label="Remarks"
          placeholder="__________"
          value={formData.remarks}
          onChange={handleChange}
        />
      </main>
    </div>
  </MultiPageAnimate>
	);
});

OtherPage.displayName = 'OtherPage';

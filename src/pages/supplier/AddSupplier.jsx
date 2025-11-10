import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiBriefcase } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { createSupplier } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { getOption } from "../../utils/FormHelper";

const AddSuppliers = () => {
	const { successPopup, errorPopup } = useStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		businessName: '',
		contactPerson: '',
		email: '',
		phone: '',
		alternatePhone: '',
		addressLine: '',
		city: '',
		state: '',
		pinCode: '',
		gstin: '',
		bankAccountNumber: '',
		ifscCode: '',
		upiId: '',
		creditLimit: 0,
		paymentTerms: '',
		rating: 5,
		remarks: '',
		isActive: true
	});
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
		createSupplier(formData).then((status) => {
			if (status === 201 || status === 200) {
				successPopup("Supplier registered successfully!");
				navigate('/suppliers');
			} else {
				errorPopup("Failed to register the supplier :(");
			}
		});
	};

	const steps = ["Basic Info", "Address & Financial", "Payment Details"];

	return (
		<PageAnimate>
			<div className={"h-full flex flex-col gap-12 justify-center items-center"}>
				<button className={"self-start flex items-center"} onClick={() => navigate(-1)}>
					<FiArrowLeft/> Go back
				</button>

				<h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
					register a new<span className={"text-rose-400"}> supplier</span> :)
				</h1>

				<Timeline steps={steps} currentStep={page} />

				<div>
					<div className={"h-full w-full flex justify-center"}>
						<main>
							{page === 1 && <BasicPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
							{page === 2 && <AddressFinancialPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
							{page === 3 && <PaymentPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
						</main>

						<div className={"p-2 flex flex-col gap-4"}>
							{page === 3 && <button className="p-3 flex-grow shadow-xl form-button-submit" onClick={submit}> <FiCheckCircle /></button>}
							{page < 3 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={nextPage}> <FiArrowRight /></button>}
							{page >= 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={backPage}> <FiArrowLeft /></button>}
						</div>
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
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="name" type="string" label="Supplier Name" placeholder={"Supplier Name"} value={formData.name} onChange={handleChange} />
					<InputBox name="businessName" type="string" label="Business Name" placeholder={"Business Name"} value={formData.businessName} onChange={handleChange} />
					<InputBox name="contactPerson" type="string" label="Contact Person" placeholder={"Contact Person"} value={formData.contactPerson} onChange={handleChange} />
					<InputBox name="email" type="string" label="Email" placeholder={"example@domain.com"} value={formData.email} onChange={handleChange} />
					<InputBox name="phone" type="string" label="Phone" placeholder={"XXXXXX"} value={formData.phone} onChange={handleChange} />
					<InputBox name="alternatePhone" type="string" label="Alternate Phone" placeholder={"XXXXXX"} value={formData.alternatePhone} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

BasicPage.displayName = 'BasicPage';

const AddressFinancialPage = React.memo(({ formData, handleChange, setFormData }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="addressLine" type="string" label="Address Line" placeholder={"Address Line"} value={formData.addressLine} onChange={handleChange} />
					<InputBox name="city" type="string" label="City" placeholder={"City"} value={formData.city} onChange={handleChange} />
					<Dropdown name={"state"} label="State" options={getOption("state")} selectedData={formData} setValue={setFormData} />
					<InputBox name="pinCode" type="number" label="Pin Code" placeholder={"Pin Code"} value={formData.pinCode} onChange={handleChange}/>
					<InputBox name="gstin" type="string" label="GSTIN" placeholder={"GSTIN"} value={formData.gstin} onChange={handleChange} />
					<InputBox name="creditLimit" type="number" label="Credit Limit" placeholder={"0"} value={formData.creditLimit} onChange={handleChange} />
					<InputBox name="paymentTerms" type="string" label="Payment Terms" placeholder={"Net 30"} value={formData.paymentTerms} onChange={handleChange} />
					<InputBox name="remarks" type="string" label="Remarks" placeholder={"Remarks"} value={formData.remarks} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

AddressFinancialPage.displayName = 'AddressFinancialPage';

const PaymentPage = React.memo(({ formData, handleChange }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="bankAccountNumber" type="string" label="Bank Account Number" placeholder={"Bank Account Number"} value={formData.bankAccountNumber} onChange={handleChange} />
					<InputBox name="ifscCode" type="string" label="IFSC Code" placeholder={"IFSC Code"} value={formData.ifscCode} onChange={handleChange} />
					<InputBox name="upiId" type="string" label="UPI ID" placeholder={"UPI ID"} value={formData.upiId} onChange={handleChange} />
					<InputBox name="rating" type="number" label="Rating (1-5)" placeholder={"5"} value={formData.rating} onChange={handleChange} inputProps={{ min: 1, max: 5 }} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});


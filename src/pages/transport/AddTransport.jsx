import React, { useState, useCallback } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTransportPartner } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { TransportMetadata } from "../../definitions/Metadata";
import { getOption, initializeFormData } from "../../utils/FormHelper";

const AddTransport = () => {
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
		gstNumber: '',
		panNumber: '',
		vehicleDetails: '',
		baseRate: 0,
		ratePerKm: 0,
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
		createTransportPartner(formData).then((status) => {
			if (status === 201 || status === 200) {
				successPopup("Transport registered successfully!");
				navigate('/transport');
			} else {
				errorPopup("Failed to register the transport :(");
			}
		});
	};

	const steps = ["Basic Info", "Address Details", "Driver Details"];
	// const steps = ["Basic Info", "Address & Rates", "Legal Details"];

	return (
		<PageAnimate>
			<div className={"h-full flex flex-col gap-12 justify-center items-center"}>
				<button className={"self-start flex items-center"} onClick={() => navigate(-1)}>
					<ArrowBackIosNewIcon/> Go back
				</button>

				<h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
					register a new<span className={"text-rose-400"}> transport</span> :)
				</h1>

				<Timeline steps={steps} currentStep={page} />

				<div>
					<div className={"h-full w-full flex justify-center"}>
						<main>
							{page === 1 && <BasicPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
							{page === 2 && <AddressPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
							{page === 3 && <LegalPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
						</main>

						<div className={"p-2 flex flex-col gap-4"}>
							{page === 3 && <button className="p-3 flex-grow shadow-xl form-button-submit" onClick={submit}> <CheckCircleIcon /></button>}
							{page < 3 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={nextPage}> <ArrowForwardIosIcon /></button>}
							{page >= 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={backPage}> <ArrowBackIosNewIcon /></button>}
						</div>
					</div>
				</div>
			</div>
		</PageAnimate>
	);
};

export default AddTransport;

const BasicPage = React.memo(({ formData, handleChange }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="name" type="string" label="Transport Name" placeholder={"__________"} value={formData.name} onChange={handleChange} />
					<InputBox name="businessName" type="string" label="Business Name" placeholder={"__________"} value={formData.businessName} onChange={handleChange} />
					<InputBox name="contactPerson" type="string" label="Contact Person" placeholder={"__________"} value={formData.contactPerson} onChange={handleChange} />
					<InputBox name="email" type="string" label="Email" placeholder={"example@domain.com"} value={formData.email} onChange={handleChange} />
					<InputBox name="phone" type="string" label="Phone" placeholder={"XXXXXX"} value={formData.phone} onChange={handleChange} />
					<InputBox name="alternatePhone" type="string" label="Alternate Phone" placeholder={"XXXXXX"} value={formData.alternatePhone} onChange={handleChange} />
					<InputBox name="vehicleDetails" type="string" label="Vehicle Details" placeholder={"Vehicle information"} value={formData.vehicleDetails} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

BasicPage.displayName = 'BasicPage';

const AddressPage = React.memo(({ formData, handleChange, setFormData }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="addressLine" type="string" label="Address Line" placeholder={"__________"} value={formData.addressLine} onChange={handleChange} />
					<InputBox name="city" type="string" label="City" placeholder={"__________"} value={formData.city} onChange={handleChange} />
					<Dropdown name={"state"} label="State" options={getOption("state")} selectedData={formData.state} setValue={setFormData} />
					<InputBox name="pinCode" type="string" label="Pin Code" placeholder={"123456"} value={formData.pinCode} onChange={handleChange} />
					<InputBox name="baseRate" type="number" label="Base Rate" placeholder={"0"} value={formData.baseRate} onChange={handleChange} />
					<InputBox name="ratePerKm" type="number" label="Rate Per KM" placeholder={"0"} value={formData.ratePerKm} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

AddressPage.displayName = 'AddressPage';

const LegalPage = React.memo(({ formData, handleChange }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="gstNumber" type="string" label="GST Number" placeholder={"GST Number"} value={formData.gstNumber} onChange={handleChange} />
					<InputBox name="panNumber" type="string" label="PAN Number" placeholder={"PAN Number"} value={formData.panNumber} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

LegalPage.displayName = 'LegalPage';

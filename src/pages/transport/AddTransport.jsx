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
import { TransportMetadata } from "../../definitions/Metadata";
import { getOption, initializeFormData } from "../../utils/FormHelper";
import styles from './styles/AddTransport.module.css';

const AddTransport = () => {
	const { successPopup, errorPopup } = useStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState(initializeFormData(TransportMetadata));
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
		addRow("/transport/add", formData).then((status) => {
			if (status === 201 || status === 200) {
				successPopup("Transport registered successfully!");
				navigate('/transport');
			} else {
				errorPopup("Failed to register the transport :(");
			}
		});
	};

	const steps = ["Basic Info", "Address Details", "Driver Details"];

	return (
		<PageAnimate>
			<div className={styles.container0}>
				<button className={styles.backButton} onClick={() => navigate(-1)}>
					<ArrowBackIosNewIcon /> Go back
				</button>

				<h1 className={styles.heading}>
					register a new<span className={styles.highlight}> transport</span> :)
				</h1>

				<Timeline steps={steps} currentStep={page} />

				<div>
					<div className={styles.formWrapper}>
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
								<DriverPage
									formData={formData}
									setFormData={setFormData}
									handleChange={handleChange}
								/>
							)}
						</main>

						<div className={styles.buttonGroup}>
							{page === 3 && (
								<button
									className="p-3 flex-grow shadow-xl form-button-submit"
									onClick={submit}
								>
									<CheckCircleIcon />
								</button>
							)}
							{page < 3 && (
								<button
									className="p-3 flex-grow shadow-xl form-button-nav"
									onClick={nextPage}
								>
									<ArrowForwardIosIcon />
								</button>
							)}
							{page >= 2 && (
								<button
									className="p-3 flex-grow shadow-xl form-button-nav"
									onClick={backPage}
								>
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

export default AddTransport;

const BasicPage = React.memo(({ formData, handleChange }) => {
	return (
		<MultiPageAnimate>
			<div className={styles.container}>
				<main className={styles.grid}>
					<InputBox name="transportName" type="string" label="Transport Name" placeholder={"__________"} value={formData.transportName} onChange={handleChange} />
					<InputBox name="businessName" type="string" label="Business Name" placeholder={"__________"} value={formData.businessName} onChange={handleChange} />
					<InputBox name="vehicleName" type="string" label="Vehicle Name" placeholder={"__________"} value={formData.vehicleName} onChange={handleChange} />
					<InputBox name="email" type="string" label="Email" placeholder={"example@domain.com"} value={formData.email} onChange={handleChange} />
					<InputBox name="mobileNumber" type="number" label="Mobile Number" placeholder={"XXXXXX"} value={formData.mobileNumber} onChange={handleChange} />
					<InputBox name="alternateMobileNumber" type="number" label="Alternate Mobile Number" placeholder={"XXXXXX"} value={formData.alternateMobileNumber} onChange={handleChange} />
					<InputBox name="status" type="string" label="Status" placeholder={"Active/Inactive"} value={formData.status} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

BasicPage.displayName = 'BasicPage';

const AddressPage = React.memo(({ formData, handleChange, setFormData }) => {
	return (
		<MultiPageAnimate>
			<div className={styles.container}>
				<main className={styles.grid}>
					<InputBox name="addressLine1" type="string" label="Address Line 1" placeholder={"__________"} value={formData.addressLine1} onChange={handleChange} />
					<InputBox name="addressLine2" type="string" label="Address Line 2" placeholder={"__________"} value={formData.addressLine2} onChange={handleChange} />
					<InputBox name="landmark" type="string" label="Landmark" placeholder={"__________"} value={formData.landmark} onChange={handleChange} />
					<InputBox name="city" type="string" label="City" placeholder={"__________"} value={formData.city} onChange={handleChange} />
					<InputBox name="district" type="string" label="District" placeholder={"__________"} value={formData.district} onChange={handleChange} />
					<Dropdown name={"state"} label="State" options={getOption("state")} selectedData={formData.state} setValue={setFormData} />
					<InputBox name="pinCode" type="number" label="Pin Code" placeholder={"123456"} value={formData.pinCode} onChange={handleChange} />
					<InputBox name="branchOffice" type="string" label="Branch Office" placeholder={"Office"} value={formData.branchOffice} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

AddressPage.displayName = 'AddressPage';

const DriverPage = React.memo(({ formData, handleChange }) => {
	return (
		<MultiPageAnimate>
			<div className={styles.container}>
				<main className={styles.grid}>
					<InputBox name="aadharNumber" type="number" label="Aadhar Number" placeholder={"1234567890"} value={formData.aadharNumber} onChange={handleChange} />
					<InputBox name="panNumber" type="number" label="Pan Number" placeholder={"1234567890"} value={formData.panNumber} onChange={handleChange} />
					<InputBox name="driverName" type="string" label="Driver Name" placeholder={"Name"} value={formData.driverName} onChange={handleChange} />
					<InputBox name="driverMobileNumber" type="number" label="Driver Mobile Number" placeholder={"1234567890"} value={formData.driverMobileNumber} onChange={handleChange} />
					<InputBox name="driverAlternateNumber" type="number" label="Driver Alternate Number" placeholder={"1234567890"} value={formData.driverAlternateNumber} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

DriverPage.displayName = 'DriverPage';

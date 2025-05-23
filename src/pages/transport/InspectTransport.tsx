import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow } from "../../network/api";
import { Transport, Metadata } from "../../definitions/Types";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import PageAnimate from "../../components/Animate/PageAnimate";

const InspectTransport = () => {
	const { transportId } = useParams();
	const [data, setData] = useState<Transport>({} as Transport);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await getRow(`/transport/edit/${transportId}`);
			setData(response as Transport);
			setLoading(false);
		};

		fetchData().then();
	}, [transportId]);

	const handleChange = handleFormFieldChange(setData);

	const metadata: Metadata[] = [
		{
			category: "Basic Information",
			elements: [
				<InputBox key="transportId" name="transportId" type="string" value={data.transportId} onChange={handleChange} placeholder="Transport ID" readOnly />,
				<InputBox key="transportName" name="transportName" type="string" value={data.transportName} onChange={handleChange} placeholder="" required />,
				<InputBox key="businessName" name="businessName" type="string" value={data.businessName} onChange={handleChange} placeholder="" required />,
				<InputBox key="vehicleName" name="vehicleName" type="string" value={data.vehicleName} onChange={handleChange} placeholder="" required />,
				<InputBox key="email" name="email" type="string" value={data.email} onChange={handleChange} placeholder="example@domain.com" required />,
				<InputBox key="mobileNumber" name="mobileNumber" type="number" value={data.mobileNumber} onChange={handleChange} placeholder="XXXXXX" required />,
				<InputBox key="alternateMobileNumber" name="alternateMobileNumber" type="number" value={data.alternateMobileNumber} onChange={handleChange} placeholder="XXXXXX" />,
				<InputBox key="status" name="status" type="string" value={data.status} onChange={handleChange} placeholder="Active/Inactive" required />,
			],
		},
		{
			category: "Address Details",
			elements: [
				<InputBox key="addressLine1" name="addressLine1" type="string" value={data.addressLine1} onChange={handleChange} placeholder="" required />,
				<InputBox key="addressLine2" name="addressLine2" type="string" value={data.addressLine2} onChange={handleChange} placeholder="" />,
				<InputBox key="landmark" name="landmark" type="string" value={data.landmark} onChange={handleChange} placeholder="" />,
				<InputBox key="city" name="city" type="string" value={data.city} onChange={handleChange} placeholder="" required />,
				<InputBox key="district" name="district" type="string" value={data.district} onChange={handleChange} placeholder="" required />,
				<InputBox key="state" name="state" type="string" value={data.state} onChange={handleChange} placeholder="" required />,
				<InputBox key="pinCode" name="pinCode" type="number" value={data.pinCode} onChange={handleChange} placeholder="123456" required />,
				<InputBox key="branchOffice" name="branchOffice" type="string" value={data.branchOffice} onChange={handleChange} placeholder="Office" required />,
			],
		},
		{
			category: "Driver Details",
			elements: [
				<InputBox key="aadharNumber" name="aadharNumber" type="number" value={data.aadharNumber} onChange={handleChange} placeholder="1234567890" required />,
				<InputBox key="panNumber" name="panNumber" type="number" value={data.panNumber} onChange={handleChange} placeholder="1234567890" required />,
				<InputBox key="driverName" name="driverName" type="string" value={data.driverName} onChange={handleChange} placeholder="Name" required />,
				<InputBox key="driverMobileNumber" name="driverMobileNumber" type="number" value={data.driverMobileNumber} onChange={handleChange} placeholder="1234567890" required />,
				<InputBox key="driverAlternateNumber" name="driverAlternateNumber" type="number" value={data.driverAlternateNumber} onChange={handleChange} placeholder="1234567890" />,
			],
		},

	];

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<PageAnimate>
			<Box sx={{ p: 3 }}>
				<Typography variant="h4" gutterBottom>
					#{transportId}
				</Typography>
				<InspectData data={data} metadata={metadata} title={"transport"} id={transportId} />
			</Box>
		</PageAnimate>
	);
};

export default InspectTransport;
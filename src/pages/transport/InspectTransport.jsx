import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTransportPartnerById } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import PageAnimate from "../../components/Animate/PageAnimate";

const InspectTransport = () => {
	const { id } = useParams();
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await getTransportPartnerById(id);
			setData(response);
			setLoading(false);
		};

		fetchData();
	}, [id]);

	const handleChange = handleFormFieldChange(setData);

	const metadata = [
		{
			category: "Basic Information",
			elements: [
				<InputBox key="id" name="id" type="string" value={data.id} onChange={handleChange} placeholder="Transport ID" readOnly />,
				<InputBox key="name" name="name" type="string" value={data.name} onChange={handleChange} placeholder="" required />,
				<InputBox key="businessName" name="businessName" type="string" value={data.businessName} onChange={handleChange} placeholder="" required />,
				<InputBox key="contactPerson" name="contactPerson" type="string" value={data.contactPerson} onChange={handleChange} placeholder="" required />,
				<InputBox key="email" name="email" type="string" value={data.email} onChange={handleChange} placeholder="example@domain.com" required />,
				<InputBox key="phone" name="phone" type="string" value={data.phone} onChange={handleChange} placeholder="XXXXXX" required />,
				<InputBox key="alternatePhone" name="alternatePhone" type="string" value={data.alternatePhone} onChange={handleChange} placeholder="XXXXXX" />,
				<InputBox key="vehicleDetails" name="vehicleDetails" type="string" value={data.vehicleDetails} onChange={handleChange} placeholder="Vehicle Details" required />,
			],
		},
		{
			category: "Address & Rate Details",
			elements: [
				<InputBox key="addressLine" name="addressLine" type="string" value={data.addressLine} onChange={handleChange} placeholder="" required />,
				<InputBox key="city" name="city" type="string" value={data.city} onChange={handleChange} placeholder="" required />,
				<InputBox key="state" name="state" type="string" value={data.state} onChange={handleChange} placeholder="" required />,
				<InputBox key="pinCode" name="pinCode" type="string" value={data.pinCode} onChange={handleChange} placeholder="123456" required />,
				<InputBox key="baseRate" name="baseRate" type="number" value={data.baseRate} onChange={handleChange} placeholder="0" required />,
				<InputBox key="ratePerKm" name="ratePerKm" type="number" value={data.ratePerKm} onChange={handleChange} placeholder="0" required />,
			],
		},
		{
			category: "Legal Details",
			elements: [
				<InputBox key="gstNumber" name="gstNumber" type="string" value={data.gstNumber} onChange={handleChange} placeholder="GST Number" required />,
				<InputBox key="panNumber" name="panNumber" type="string" value={data.panNumber} onChange={handleChange} placeholder="PAN Number" required />,
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
					#{id}
				</Typography>
				<InspectData data={data} metadata={metadata} title={"transport"} id={id} />
			</Box>
		</PageAnimate>
	);
};

export default InspectTransport;

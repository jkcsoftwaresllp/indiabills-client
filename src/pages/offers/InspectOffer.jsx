import PageAnimate from "../../components/Animate/PageAnimate";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOfferById } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";

const InspectOffer = () => {
	const { id } = useParams();
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await getOfferById(id);
			setData(response);
			setLoading(false);
		};

		fetchData();
	}, [id]);

	const handleChange = handleFormFieldChange(setData);

	const formatDate = (dateString) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toISOString().split('T')[0];
	};

	const metadata = [
		{
			category: "Basic Information",
			elements: [
				<InputBox key="name" name="name" type="string" label="Offer Name" value={data.name} onChange={handleChange} placeholder="" />,
				<InputBox key="description" name="description" type="string" label="Description" value={data.description} onChange={handleChange} placeholder="" />,
				<Dropdown key="offerType" name="offerType" label="Offer Type" options={["product_discount", "order_discount", "shipping_discount"]} selectedData={data} setValue={setData} />,
				<InputBox key="startDate" name="startDate" type="date" label="Start Date" value={formatDate(data.startDate)} onChange={handleChange} placeholder="" />,
				<InputBox key="endDate" name="endDate" type="date" label="End Date" value={formatDate(data.endDate)} onChange={handleChange} placeholder="" />,
			],
		},
		{
			category: "Discount Details",
			elements: [
				<Dropdown key="discountType" name="discountType" label="Discount Type" options={["percentage", "fixed"]} selectedData={data} setValue={setData} />,
				<InputBox key="discountValue" name="discountValue" type="number" label="Discount Value" value={data.discountValue} onChange={handleChange} placeholder="" />,
				<InputBox key="maxDiscountAmount" name="maxDiscountAmount" type="number" label="Maximum Discount Amount" value={data.maxDiscountAmount} onChange={handleChange} placeholder="" />,
				<InputBox key="minOrderAmount" name="minOrderAmount" type="number" label="Minimum Order Amount" value={data.minOrderAmount} onChange={handleChange} placeholder="" />,
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
				<InspectData data={data} metadata={metadata} title={"offers"} id={id} />
			</Box>
		</PageAnimate>
	);
};

export default InspectOffer;

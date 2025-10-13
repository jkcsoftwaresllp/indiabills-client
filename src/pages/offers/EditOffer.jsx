import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOfferById, updateOffer } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const OFFER_TYPES = ['product_discount', 'order_discount', 'buy_x_get_y', 'free_shipping'];
const DISCOUNT_TYPES = ['fixed', 'percentage'];

const EditOffer = () => {
  const { offerId } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getOfferById(offerId);
      setData(response);
      setLoading(false);
    };

    fetchData();
  }, [offerId]);

  const handleChange = handleFormFieldChange(setData);

  const handleSave = async (updatedData) => {
    const response = await updateOffer(offerId, updatedData);
    if (response === 200) {
      successPopup('Offer updated successfully');
      return true;
    } else {
      errorPopup('Failed to update offer');
      return false;
    }
  };

  const metadata = [
    {
      category: "Basic Information",
      elements: [
        <InputBox key="name" name="name" type="string" label="Offer Name" value={data.name} onChange={handleChange} placeholder="" />,
        <InputBox key="description" name="description" type="string" label="Description" value={data.description} onChange={handleChange} placeholder="" />,
        <Dropdown key="offerType" name="offerType" label="Offer Type" options={OFFER_TYPES} selectedData={data} setValue={setData} variant="select" />,
        <Dropdown key="discountType" name="discountType" label="Discount Type" options={DISCOUNT_TYPES} selectedData={data} setValue={setData} variant="select" />,
      ],
    },
    {
      category: "Discount Information",
      elements: [
        <InputBox key="discountValue" name="discountValue" type="number" label="Discount Value" value={data.discountValue} onChange={handleChange} placeholder="" />,
        <InputBox key="maxDiscountAmount" name="maxDiscountAmount" type="number" label="Max Discount Amount" value={data.maxDiscountAmount} onChange={handleChange} placeholder="" />,
        <InputBox key="minOrderAmount" name="minOrderAmount" type="number" label="Min Order Amount" value={data.minOrderAmount} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Validity Period",
      elements: [
        <InputBox key="startDate" name="startDate" type="datetime-local" label="Start Date" value={data.startDate} onChange={handleChange} placeholder="" />,
        <InputBox key="endDate" name="endDate" type="datetime-local" label="End Date" value={data.endDate} onChange={handleChange} placeholder="" />,
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Offer #{offerId}
      </Typography>
      <InspectData 
        data={data} 
        metadata={metadata} 
        title={"offers"} 
        id={offerId}
        onSave={handleSave}
      />
    </Box>
  );
};

export default EditOffer;

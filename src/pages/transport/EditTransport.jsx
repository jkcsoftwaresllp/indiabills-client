import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTransportPartnerById, updateTransportPartner } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const EditTransport = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTransportPartnerById(id);
      setData(response);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleChange = handleFormFieldChange(setData);

  const handleSave = async (updatedData) => {
    const response = await updateTransportPartner(id, updatedData);
    if (response === 200) {
      successPopup('Transport partner updated successfully');
      return true;
    } else {
      errorPopup('Failed to update transport partner');
      return false;
    }
  };

  const metadata = [
    {
      category: "Basic Information",
      elements: [
        <InputBox key="name" name="name" type="string" label="Transport Name" value={data.name} onChange={handleChange} placeholder="" />,
        <InputBox key="businessName" name="businessName" type="string" label="Business Name" value={data.businessName} onChange={handleChange} placeholder="" />,
        <InputBox key="contactPerson" name="contactPerson" type="string" label="Contact Person" value={data.contactPerson} onChange={handleChange} placeholder="" />,
        <InputBox key="email" name="email" type="string" label="Email" value={data.email} onChange={handleChange} placeholder="" />,
        <InputBox key="phone" name="phone" type="string" label="Phone" value={data.phone} onChange={handleChange} placeholder="" />,
        <InputBox key="alternatePhone" name="alternatePhone" type="string" label="Alternate Phone" value={data.alternatePhone} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Address Information",
      elements: [
        <InputBox key="addressLine" name="addressLine" type="string" label="Address Line" value={data.addressLine} onChange={handleChange} placeholder="" />,
        <InputBox key="city" name="city" type="string" label="City" value={data.city} onChange={handleChange} placeholder="" />,
        <InputBox key="state" name="state" type="string" label="State" value={data.state} onChange={handleChange} placeholder="" />,
        <InputBox key="pinCode" name="pinCode" type="string" label="Pin Code" value={data.pinCode} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Financial & Vehicle Information",
      elements: [
        <InputBox key="panNumber" name="panNumber" type="string" label="PAN Number" value={data.panNumber} onChange={handleChange} placeholder="" />,
        <InputBox key="gstNumber" name="gstNumber" type="string" label="GST Number" value={data.gstNumber} onChange={handleChange} placeholder="" />,
        <InputBox key="baseRate" name="baseRate" type="number" label="Base Rate" value={data.baseRate} onChange={handleChange} placeholder="" />,
        <InputBox key="ratePerKm" name="ratePerKm" type="number" label="Rate Per KM" value={data.ratePerKm} onChange={handleChange} placeholder="" />,
        <InputBox key="vehicleDetails" name="vehicleDetails" type="string" label="Vehicle Details" value={data.vehicleDetails} onChange={handleChange} placeholder="" />,
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
        Edit Transport Partner #{id}
      </Typography>
      <InspectData 
        data={data} 
        metadata={metadata} 
        title={"transport"} 
        id={id}
        onSave={handleSave}
      />
    </Box>
  );
};

export default EditTransport;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSupplierById, updateSupplier } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const EditSupplier = () => {
  const { supplierId } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSupplierById(supplierId);
      setData(response);
      setLoading(false);
    };

    fetchData();
  }, [supplierId]);

  const handleChange = handleFormFieldChange(setData);

  const handleSave = async (updatedData) => {
    const response = await updateSupplier(supplierId, updatedData);
    if (response === 200) {
      successPopup('Supplier updated successfully');
      return true;
    } else {
      errorPopup('Failed to update supplier');
      return false;
    }
  };

  const metadata = [
    {
      category: "Basic Information",
      elements: [
        <InputBox key="name" name="name" type="string" label="Supplier Name" value={data.name} onChange={handleChange} placeholder="" />,
        <InputBox key="businessName" name="businessName" type="string" value={data.businessName} onChange={handleChange} placeholder="" />,
        <InputBox key="contactPerson" name="contactPerson" type="string" value={data.contactPerson} onChange={handleChange} placeholder="" />,
        <InputBox key="email" name="email" type="string" value={data.email} onChange={handleChange} placeholder="" />,
        <InputBox key="phone" name="phone" type="string" value={data.phone} onChange={handleChange} placeholder="" />,
        <InputBox key="alternatePhone" name="alternatePhone" type="string" value={data.alternatePhone} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Address Information",
      elements: [
        <InputBox key="addressLine" name="addressLine" type="string" value={data.addressLine} onChange={handleChange} placeholder="" />,
        <InputBox key="city" name="city" type="string" value={data.city} onChange={handleChange} placeholder="" />,
        <InputBox key="state" name="state" type="string" value={data.state} onChange={handleChange} placeholder="" />,
        <InputBox key="pinCode" name="pinCode" type="string" value={data.pinCode} onChange={handleChange} placeholder="" />,
        <InputBox key="gstin" name="gstin" type="string" value={data.gstin} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Financial & Payment Information",
      elements: [
        <InputBox key="bankAccountNumber" name="bankAccountNumber" type="string" value={data.bankAccountNumber} onChange={handleChange} placeholder="" />,
        <InputBox key="ifscCode" name="ifscCode" type="string" value={data.ifscCode} onChange={handleChange} placeholder="" />,
        <InputBox key="upiId" name="upiId" type="string" value={data.upiid} onChange={handleChange} placeholder="" />,
        <InputBox key="creditLimit" name="creditLimit" type="number" value={data.creditLimit} onChange={handleChange} placeholder="" />,
        <InputBox key="paymentTerms" name="paymentTerms" type="string" value={data.paymentTerms} onChange={handleChange} placeholder="" />,
        <InputBox key="rating" name="rating" type="number" value={data.rating} onChange={handleChange} placeholder="" inputProps={{ min: 1, max: 5 }} />,
        <InputBox key="remarks" name="remarks" type="string" value={data.remarks} onChange={handleChange} placeholder="" />,
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
        Edit Supplier #{supplierId}
      </Typography>
      <InspectData 
        data={data} 
        metadata={metadata} 
        title={"suppliers"} 
        id={supplierId}
        onSave={handleSave}
      />
    </Box>
  );
};

export default EditSupplier;

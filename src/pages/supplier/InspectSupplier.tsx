import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow } from "../../network/api";
import { Supplier, Metadata } from "../../definitions/Types";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import {handleFormFieldChange} from "../../utils/FormHelper";

const InspectSupplier = () => {
  const { supplierId } = useParams();
  const [data, setData] = useState<Supplier>({} as Supplier);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRow(`/suppliers/edit/${supplierId}`);
      setData(response as Supplier);
      setLoading(false);
    };

    fetchData().then();
  }, [supplierId]);

  const handleChange = handleFormFieldChange(setData);

  const metadata: Metadata[] = [
    {
      category: "Basic Information",
      elements: [
        <InputBox key="supplierName" name="supplierName" type="string" value={data.supplierName} onChange={handleChange} placeholder="" />,
        <InputBox key="businessName" name="businessName" type="string" value={data.businessName} onChange={handleChange} placeholder="" />,
        <InputBox key="email" name="email" type="string" value={data.email} onChange={handleChange} placeholder="" />,
        <InputBox key="mobileNumber" name="mobileNumber" type="number" value={data.mobileNumber} onChange={handleChange} placeholder="" />,
        <InputBox key="alternateMobileNumber" name="alternateMobileNumber" type="numbera" value={data.alternateMobileNumber} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Address Information",
      elements: [
        <InputBox key="addressLine1" name="addressLine1" type="string" value={data.addressLine1} onChange={handleChange} placeholder="" />,
        <InputBox key="addressLine2" name="addressLine2" type="string" value={data.addressLine2} onChange={handleChange} placeholder="" />,
        <InputBox key="city" name="city" type="string" value={data.city} onChange={handleChange} placeholder="" />,
        <InputBox key="state" name="state" type="string" value={data.state} onChange={handleChange} placeholder="" />,
        <InputBox key="pinCode" name="pinCode" type="number" value={data.pinCode} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Other Information",
      elements: [
        <InputBox key="beneficiaryName" name="beneficiaryName" type="string" value={data.beneficiaryName} onChange={handleChange} placeholder="" />,
        <InputBox key="accountNumber" name="accountNumber" type="number" value={data.accountNumber} onChange={handleChange} placeholder="" />,
        <InputBox key="ifscCode" name="ifscCode" type="number" value={data.ifscCode} onChange={handleChange} placeholder="" />,
        <InputBox key="virtualPaymentAddress" name="virtualPaymentAddress" type="number" value={data.virtualPaymentAddress} onChange={handleChange} placeholder="" />,
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
        #{supplierId}
      </Typography>
      <InspectData data={data} metadata={metadata} title={"suppliers"} id={supplierId} />
    </Box>
  );
};

export default InspectSupplier;
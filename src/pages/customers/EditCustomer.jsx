import { FiCheckCircle, FiDollarSign, FiEdit, FiFileText } from 'react-icons/fi';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomerById, updateCustomer } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const EditCustomer = () => {
    const { customerId } = useParams();
    const [data, setData] = useState<Customer>({});
    const [loading, setLoading] = useState(true);
    const { successPopup, errorPopup } = useStore();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getCustomerById(customerId);
            setData(response);
            setLoading(false);
        };

        fetchData().then();
    }, [customerId]);

    const handleChange = handleFormFieldChange(setData);

    const handleSave = async (updatedData) => {
        const response = await updateCustomer(customerId, updatedData);
        if (response === 200) {
            successPopup('Customer updated successfully');
            return true;
        } else {
            errorPopup('Failed to update customer');
            return false;
        }
    };

    const metadata = [
        {
            category: "Basic Information",
            elements: [
                <InputBox key="first_name" name="first_name" type="string" label="First Name" value={data.first_name} onChange={handleChange} placeholder="" />,
                <InputBox key="middle_name" name="middle_name" type="string" label="Middle Name" value={data.middle_name} onChange={handleChange} placeholder="" />,
                <InputBox key="last_name" name="last_name" type="string" label="Last Name" value={data.last_name} onChange={handleChange} placeholder="" />,
                <InputBox key="email" name="email" type="email" value={data.email} onChange={handleChange} placeholder="" />,
                <InputBox key="phone" name="phone" type="string" value={data.phone} onChange={handleChange} placeholder="" />,
                <InputBox key="date_of_birth" name="date_of_birth" type="date" label="Date of Birth" value={data.date_of_birth} onChange={handleChange} placeholder="" />,
                <Dropdown key="gender" name="gender" label="Gender" options={["male", "female", "other", "prefer_not_to_say"]} selectedData={data} setValue={setData} />,
                <Dropdown key="customer_type" name="customer_type" label="Customer Type" options={["individual", "business"]} selectedData={data} setValue={setData} />,
                <InputBox key="business_name" name="business_name" type="string" label="Business Name" value={data.business_name} onChange={handleChange} placeholder="" />,
                <InputBox key="gstin" name="gstin" type="string" label="GSTIN" value={data.gstin} onChange={handleChange} placeholder="" />,
                <InputBox key="fssai_number" name="fssai_number" type="string" label="FSSAI Number" value={data.fssai_number} onChange={handleChange} placeholder="" />,
                <InputBox key="pan_number" name="pan_number" type="string" label="PAN Number" value={data.pan_number} onChange={handleChange} placeholder="" />,
                <InputBox key="aadhar_number" name="aadhar_number" type="string" label="Aadhar Number" value={data.aadhar_number} onChange={handleChange} placeholder="" />,
                <InputBox key="credit_limit" name="credit_limit" type="number" label="Credit Limit" value={data.credit_limit} onChange={handleChange} placeholder="" />,
                <InputBox key="loyalty_points" name="loyalty_points" type="number" label="Loyalty Points" value={data.loyalty_points} onChange={handleChange} placeholder="" />,
                <Dropdown key="is_active" name="is_active" label="Active" options={[true, false]} selectedData={data} setValue={setData} />,
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
                Edit Customer #{customerId}
            </Typography>
            <InspectData 
                data={data} 
                metadata={metadata} 
                title={"customers"} 
                id={customerId}
                onSave={handleSave}
            />
        </Box>
    );
};

export default EditCustomer;
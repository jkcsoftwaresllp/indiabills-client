import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow, updatePut, getData } from "../../network/api";
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
            try {
                const response = await getData(`/ops/sales/portal/customer/profile`);
                if (response.success) {
                    setData(response.data);
                } else {
                    throw new Error('New API failed');
                }
            } catch (error) {
                console.error('Error with new API, falling back to old API:', error);
            }
            setLoading(false);
        };

        fetchData().then();
    }, [customerId]);

    const handleChange = handleFormFieldChange(setData);

    const handleSave = async (updatedData) => {
        try {
            const response = await updatePut(`/ops/sales/portal/customer/profile`, updatedData);
            if (response === 200) {
                successPopup('Profile updated successfully');
                return true;
            } else {
                throw new Error('New API failed');
            }
        } catch (error) {
            console.error('Error with new API, falling back to old API:', error);
            // Fallback to old API
            if (await updatePut(`/customers/edit/${customerId}`, updatedData) === 200) {
                successPopup('Profile updated successfully');
                return true;
            } else {
                errorPopup('Failed to update profile');
                return false;
            }
        }
    };

    const metadata = [
        {
            category: "Basic Information",
            elements: [
                <InputBox key="name" name="name" type="string" label="Full Name" value={data.name || data.customerName} onChange={handleChange} placeholder="" />,
                <InputBox key="email" name="email" type="string" value={data.email} onChange={handleChange} placeholder="" />,
                <InputBox key="phone" name="phone" type="string" value={data.phone || data.mobile} onChange={handleChange} placeholder="" />,
                <InputBox key="dateOfBirth" name="dateOfBirth" type="date" label="Date of Birth" value={data.dateOfBirth} onChange={handleChange} placeholder="" />,
                <Dropdown key="gender" name="gender" label="Gender" options={["male", "female", "other", "prefer_not_to_say"]} selectedData={data.gender} setValue={setData} />,
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
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow } from "../../network/api";
import { Customer, Metadata } from "../../definitions/Types";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";

const EditCustomer = () => {
    const { customerId } = useParams();
    const [data, setData] = useState<Customer>({} as Customer);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRow(`/customers/edit/${customerId}`);
            setData(response as Customer);
            setLoading(false);
        };

        fetchData().then();
    }, [customerId]);

    const handleChange = handleFormFieldChange(setData);

    const metadata: Metadata[] = [
        {
            category: "Basic Information",
            elements: [
                <InputBox key="customerName" name="customerName" type="string" value={data.customerName} onChange={handleChange} placeholder="" />,
                <InputBox key="businessName" name="businessName" type="string" value={data.businessName} onChange={handleChange} placeholder="" />,
                <Dropdown key="gender" name="gender" label="Gender" options={["male", "female", "others", "prefer not to say"]} selectedData={data.gender} setValue={setData} />,
                <InputBox key="email" name="email" type="string" value={data.email} onChange={handleChange} placeholder="" />,
                <InputBox key="mobile" name="mobile" type="string" value={data.mobile} onChange={handleChange} placeholder="" />,
                <InputBox key="alternateMobile" name="alternateMobile" type="string" value={data.alternateMobile} onChange={handleChange} placeholder="" />,
            ],
        },
        {
            category: "Document Information",
            elements: [
                <InputBox key="gstin" name="gstin" type="string" value={data.gstin} onChange={handleChange} placeholder="" />,
                <InputBox key="fssai" name="fssai" type="string" value={data.fssai} onChange={handleChange} placeholder="" />,
                <InputBox key="registrationNumber" name="registrationNumber" type="string" value={data.registrationNumber} onChange={handleChange} placeholder="" />,
                <InputBox key="aadharNumber" name="aadharNumber" type="string" value={data.aadharNumber} onChange={handleChange} placeholder="" />,
                <InputBox key="panNumber" name="panNumber" type="string" value={data.panNumber} onChange={handleChange} placeholder="" />,
                <InputBox key="otherDocuments" name="otherDocuments" type="string" value={data.otherDocuments} onChange={handleChange} placeholder="" />,
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
            <InspectData data={data} metadata={metadata} title={"customers"} id={customerId} />
        </Box>
    );
};

export default EditCustomer;
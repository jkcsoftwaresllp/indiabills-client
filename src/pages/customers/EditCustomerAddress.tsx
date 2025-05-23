import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow } from "../../network/api";
import { CustomerAddress, Metadata } from "../../definitions/Types";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";

const EditCustomerAddress = () => {
    const { addressId } = useParams();
    const [data, setData] = useState<CustomerAddress>({} as CustomerAddress);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRow(`/customers/address/edit/${addressId}`);
            setData(response as CustomerAddress);
            setLoading(false);
        };

        fetchData().then();
    }, [addressId]);

    const handleChange = handleFormFieldChange(setData);

    const metadata: Metadata[] = [
        {
            category: "Address Information",
            elements: [
                <InputBox key="addressType" name="addressType" type="string" value={data.addressType} onChange={handleChange} placeholder="" />,
                <InputBox key="addressLine" name="addressLine" type="string" value={data.addressLine} onChange={handleChange} placeholder="Plot, Street, Town" />,
                <InputBox key="landmark" name="landmark" type="string" value={data.landmark} onChange={handleChange} placeholder="" />,
                <InputBox key="city" name="city" type="string" value={data.city} onChange={handleChange} placeholder="" />,
                <InputBox key="state" name="state" type="string" value={data.state} onChange={handleChange} placeholder="" />,
                <InputBox key="pinCode" name="pinCode" type="string" value={data.pinCode} onChange={handleChange} placeholder="00000" />,
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
                Edit Address #{addressId}
            </Typography>
            <InspectData data={data} metadata={metadata} title={"customers"} id={addressId} url={`/customers/address/edit/${addressId}`} />
        </Box>
    );
};

export default EditCustomerAddress;
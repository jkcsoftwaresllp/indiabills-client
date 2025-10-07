import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWarehouseById, updateWarehouse } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange, getOption } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const EditWarehouse = () => {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { successPopup, errorPopup } = useStore();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getWarehouseById(id);
            setData(response);
            setLoading(false);
        };

        fetchData().then();
    }, [id]);

    const handleChange = handleFormFieldChange(setData);

    const handleSave = async (updatedData) => {
        const response = await updateWarehouse(id, updatedData);
        if (response === 200) {
            successPopup('Warehouse updated successfully');
            return true;
        } else {
            errorPopup('Failed to update warehouse');
            return false;
        }
    };

    const metadata = [
        {
            category: "Basic Information",
            elements: [
                <InputBox key="name" name="name" type="text" label="Warehouse Name" value={data.name} onChange={handleChange} placeholder="" />,
                <InputBox key="code" name="code" type="text" label="Warehouse Code" value={data.code} onChange={handleChange} placeholder="" />,
                <InputBox key="capacity" name="capacity" type="number" label="Capacity" value={data.capacity} onChange={handleChange} placeholder="" />,
                <InputBox key="managerName" name="managerName" type="text" label="Manager Name" value={data.managerName} onChange={handleChange} placeholder="" />,
                <InputBox key="managerPhone" name="managerPhone" type="text" label="Manager Phone" value={data.managerPhone} onChange={handleChange} placeholder="" />,
            ],
        },
        {
            category: "Address Information",
            elements: [
                <InputBox key="addressLine" name="addressLine" type="text" label="Address Line" value={data.addressLine} onChange={handleChange} placeholder="" />,
                <InputBox key="city" name="city" type="text" label="City" value={data.city} onChange={handleChange} placeholder="" />,
                <Dropdown key="state" name="state" label="State" options={getOption("state")} selectedData={data} setValue={setData} />,
                <InputBox key="pinCode" name="pinCode" type="text" label="Pin Code" value={data.pinCode} onChange={handleChange} placeholder="" />,
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
                Edit Warehouse #{id}
            </Typography>
            <InspectData 
                data={data} 
                metadata={metadata} 
                title={"warehouses"} 
                id={id}
                onSave={handleSave}
            />
        </Box>
    );
};

export default EditWarehouse;

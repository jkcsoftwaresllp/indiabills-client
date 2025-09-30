import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { getWarehouseById } from '../../network/api';
import PageAnimate from '../../components/Animate/PageAnimate';
import InspectData from '../../layouts/form/InspectData';
import InputBox from '../../components/FormComponent/InputBox';
import Dropdown from '../../components/FormComponent/Dropdown';
import { Box, Typography, CircularProgress } from '@mui/material';
import { handleFormFieldChange, getOption } from '../../utils/FormHelper';

const InspectWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseData = await getWarehouseById(id);
        if (warehouseData) {
          setData(warehouseData);
        } else {
          errorPopup('Warehouse not found');
          navigate('/warehouses');
        }
      } catch (error) {
        console.error('Error fetching warehouse:', error);
        errorPopup('Failed to load warehouse data');
        navigate('/warehouses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = handleFormFieldChange(setData);

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
    <PageAnimate>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Warehouse #{id}
        </Typography>
        <InspectData 
          data={data} 
          metadata={metadata} 
          title="warehouses" 
          id={id}
        />
      </Box>
    </PageAnimate>
  );
};

export default InspectWarehouse;
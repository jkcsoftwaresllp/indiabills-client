import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { createWarehouse } from '../../network/api';
import PageAnimate from '../../components/Animate/PageAnimate';
import InputBox from '../../components/FormComponent/InputBox';
import Dropdown from '../../components/FormComponent/Dropdown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getOption } from '../../utils/FormHelper';

const AddWarehouse = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
    capacity: 0,
    managerName: '',
    managerPhone: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.addressLine) {
      errorPopup('Please fill in all required fields');
      return;
    }

    try {
      const status = await createWarehouse(formData);
      
      if (status === 200 || status === 201) {
        successPopup('Warehouse created successfully!');
        navigate('/warehouses');
      } else {
        errorPopup('Failed to create warehouse');
      }
    } catch (error) {
      console.error('Error creating warehouse:', error);
      errorPopup('Failed to create warehouse');
    }
  };

  return (
    <PageAnimate>
      <div className="h-full flex flex-col gap-12 justify-center items-center">
        <button 
          className="self-start flex items-center" 
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon /> Go back
        </button>

        <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
          create new <span className="text-rose-400">warehouse</span>
        </h1>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center gap-8 idms-bg">
          <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            <InputBox
              name="name"
              type="text"
              label="Warehouse Name"
              placeholder="Main Warehouse"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <InputBox
              name="code"
              type="text"
              label="Warehouse Code"
              placeholder="WH001"
              value={formData.code}
              onChange={handleChange}
              required
            />
            
            <InputBox
              name="capacity"
              type="number"
              label="Capacity"
              placeholder="1000"
              value={formData.capacity}
              onChange={handleChange}
            />
            
            <InputBox
              name="managerName"
              type="text"
              label="Manager Name"
              placeholder="John Doe"
              value={formData.managerName}
              onChange={handleChange}
            />
            
            <InputBox
              name="managerPhone"
              type="text"
              label="Manager Phone"
              placeholder="9876543210"
              value={formData.managerPhone}
              onChange={handleChange}
            />
            
            <InputBox
              name="addressLine"
              type="text"
              label="Address Line"
              placeholder="Street, Area"
              value={formData.addressLine}
              onChange={handleChange}
              required
            />
            
            <InputBox
              name="city"
              type="text"
              label="City"
              placeholder="Mumbai"
              value={formData.city}
              onChange={handleChange}
            />
            
            <Dropdown
              name="state"
              label="State"
              options={getOption("state")}
              selectedData={formData}
              setValue={setFormData}
            />
            
            <InputBox
              name="pinCode"
              type="text"
              label="Pin Code"
              placeholder="400001"
              value={formData.pinCode}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="p-3 flex-grow shadow-xl form-button-submit flex items-center gap-2"
          >
            <CheckCircleIcon />
            Create Warehouse
          </button>
        </form>
      </div>
    </PageAnimate>
  );
};

export default AddWarehouse;
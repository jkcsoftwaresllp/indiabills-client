import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { createReconciliation, getWarehouses } from '../../network/api';
import PageAnimate from '../../components/Animate/PageAnimate';
import InputBox from '../../components/FormComponent/InputBox';
import DropdownBar from '../../components/FormComponent/DropdownBar';

const AddReconciliation = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    warehouseId: null,
  });
  
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const data = await getWarehouses();
      setWarehouses(data);
    };
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedWarehouse) {
      errorPopup('Please select a warehouse');
      return;
    }

    const reconciliationData = {
      date: formData.date,
      notes: formData.notes,
      warehouseId: selectedWarehouse.id
    };

    const response = await createReconciliation(reconciliationData);
    
    if (response === 200 || response === 201) {
      successPopup('Reconciliation created successfully!');
      navigate('/inventory/reconciliations');
    } else {
      errorPopup('Failed to create reconciliation');
    }
  };

  return (
    <PageAnimate>
      <div className="h-full flex flex-col gap-12 justify-center items-center">
        <button 
          className="self-start flex items-center" 
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Go back
        </button>

        <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
          create new <span className="text-rose-400">reconciliation</span>
        </h1>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center gap-8 idms-bg">
          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <DropdownBar
              data={warehouses}
              selectedData={selectedWarehouse}
              setSelectedData={setSelectedWarehouse}
              label="Select Warehouse"
            />
            
            <InputBox
              name="date"
              type="date"
              label="Reconciliation Date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            
            <InputBox
              name="notes"
              type="text"
              label="Notes"
              placeholder="Optional notes about this reconciliation"
              value={formData.notes}
              onChange={handleChange}
              multiline={true}
            />
          </div>

          <button
            type="submit"
            className="p-3 flex-grow shadow-xl form-button-submit flex items-center gap-2"
            disabled={!selectedWarehouse}
          >
            <FiCheckCircle />
            Create Reconciliation
          </button>
        </form>
      </div>
    </PageAnimate>
  );
};

export default AddReconciliation;
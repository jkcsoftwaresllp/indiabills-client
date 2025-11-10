import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { createInventoryMovement, getWarehouses, getProducts, getBatches } from '../../network/api';
import PageAnimate from '../../components/Animate/PageAnimate';
import InputBox from '../../components/FormComponent/InputBox';
import Dropdown from '../../components/FormComponent/Dropdown';

const MOVEMENT_TYPES = [
  { id: 'in', name: 'In (Stock Received)' },
  { id: 'out', name: 'Out (Stock Issued)' },
  { id: 'transfer_out', name: 'Transfer Out' },
  { id: 'transfer_in', name: 'Transfer In' },
  { id: 'adjustment_positive', name: 'Adjustment (+)' },
  { id: 'adjustment_negative', name: 'Adjustment (-)' },
  { id: 'reserved', name: 'Reserved' },
  { id: 'unreserved', name: 'Unreserved' }
];

const AddInventoryMovement = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();
  
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    warehouse_id: '',
    product_id: '',
    batch_id: '',
    movement_type: '',
    quantity: 0,
    unit_cost: 0,
    reference: '',
    transaction_id: '',
    remarks: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehousesData, productsData] = await Promise.all([
          getWarehouses(),
          getProducts()
        ]);
        
        setWarehouses(Array.isArray(warehousesData) ? warehousesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        errorPopup('Failed to load data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProduct && selectedWarehouse) {
      const fetchBatches = async () => {
        try {
          const batchesData = await getBatches({
            product_id: selectedProduct.id,
            warehouse_id: selectedWarehouse.id
          });
          setBatches(Array.isArray(batchesData) ? batchesData : []);
        } catch (error) {
          console.error('Error fetching batches:', error);
          setBatches([]);
        }
      };
      fetchBatches();
    }
  }, [selectedProduct, selectedWarehouse]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.warehouse_id || !formData.product_id || !formData.movement_type) {
      errorPopup('Please fill in all required fields');
      return;
    }

    if (formData.quantity <= 0) {
      errorPopup('Quantity must be greater than 0');
      return;
    }

    if (formData.unit_cost < 0) {
      errorPopup('Unit cost cannot be negative');
      return;
    }

    try {
      const payload = {
        warehouse_id: Number(formData.warehouse_id),
        product_id: Number(formData.product_id),
        movement_type: formData.movement_type,
        quantity: Number(formData.quantity),
        unit_cost: Number(formData.unit_cost),
        reference: formData.reference,
        remarks: formData.remarks
      };

      if (formData.batch_id) {
        payload.batch_id = Number(formData.batch_id);
      }

      if (formData.transaction_id) {
        payload.transaction_id = formData.transaction_id;
      }

      const status = await createInventoryMovement(payload);
      
      if (status === 200 || status === 201) {
        successPopup('Inventory movement recorded successfully!');
        navigate('/inventory-movements');
      } else {
        errorPopup('Failed to record inventory movement');
      }
    } catch (error) {
      console.error('Error creating inventory movement:', error);
      errorPopup('Failed to record inventory movement');
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
          record <span className="text-rose-400">inventory movement</span>
        </h1>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center gap-8 idms-bg">
          <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="col-span-2">
              <select
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setFormData(prev => ({ ...prev, warehouse_id: id }));
                  setSelectedWarehouse(warehouses.find(w => w.id === id));
                }}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <select
                name="product_id"
                value={formData.product_id}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setFormData(prev => ({ ...prev, product_id: id }));
                  setSelectedProduct(products.find(p => p.id === id));
                }}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {batches.length > 0 && (
              <div className="col-span-2">
                <select
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch_id: Number(e.target.value) }))}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select Batch (Optional)</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>Batch #{b.id}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-span-2">
              <select
                name="movement_type"
                value={formData.movement_type}
                onChange={(e) => setFormData(prev => ({ ...prev, movement_type: e.target.value }))}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Movement Type</option>
                {MOVEMENT_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <InputBox
              name="quantity"
              type="number"
              label="Quantity"
              placeholder="100.5"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            
            <InputBox
              name="unit_cost"
              type="number"
              label="Unit Cost"
              placeholder="25.50"
              value={formData.unit_cost}
              onChange={handleChange}
            />

            <InputBox
              name="reference"
              type="text"
              label="Reference (e.g., PO Number)"
              placeholder="PO-2025-1001"
              value={formData.reference}
              onChange={handleChange}
            />

            <InputBox
              name="transaction_id"
              type="text"
              label="Transaction ID (Optional)"
              placeholder="TXN-123456"
              value={formData.transaction_id}
              onChange={handleChange}
            />

            <div className="col-span-2">
              <InputBox
                name="remarks"
                type="text"
                label="Remarks"
                placeholder="Additional notes..."
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="p-3 flex-grow shadow-xl form-button-submit flex items-center gap-2"
          >
            <FiCheckCircle />
            Record Movement
          </button>
        </form>
      </div>
    </PageAnimate>
  );
};

export default AddInventoryMovement;

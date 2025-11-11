import { FiArrowLeft, FiCheckCircle, FiPlus } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { createInventoryStock, getWarehouses, getProducts, getBatches } from '../../network/api';
import PageAnimate from '../../components/Animate/PageAnimate';
import InputBox from '../../components/FormComponent/InputBox';
import Dropdown from '../../components/FormComponent/Dropdown';

const AddInventoryStock = () => {
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
    available_quantity: 0,
    reserved_quantity: 0,
    last_movement_id: ''
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
    
    if (!formData.warehouse_id || !formData.product_id) {
      errorPopup('Please select warehouse and product');
      return;
    }

    if (formData.available_quantity < 0 || formData.reserved_quantity < 0) {
      errorPopup('Quantities must be positive');
      return;
    }

    try {
      const payload = {
        warehouse_id: Number(formData.warehouse_id),
        product_id: Number(formData.product_id),
        available_quantity: Number(formData.available_quantity),
        reserved_quantity: Number(formData.reserved_quantity)
      };

      if (formData.batch_id) {
        payload.batch_id = Number(formData.batch_id);
      }

      if (formData.last_movement_id) {
        payload.last_movement_id = Number(formData.last_movement_id);
      }

      const status = await createInventoryStock(payload);
      
      if (status === 200 || status === 201) {
        successPopup('Inventory stock created successfully!');
        navigate('/inventory-stock');
      } else {
        errorPopup('Failed to create inventory stock');
      }
    } catch (error) {
      console.error('Error creating inventory stock:', error);
      errorPopup('Failed to create inventory stock');
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
          add new <span className="text-rose-400">inventory stock</span>
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
            
            <InputBox
              name="available_quantity"
              type="number"
              label="Available Quantity"
              placeholder="100"
              value={formData.available_quantity}
              onChange={handleChange}
              required
            />
            
            <InputBox
              name="reserved_quantity"
              type="number"
              label="Reserved Quantity"
              placeholder="0"
              value={formData.reserved_quantity}
              onChange={handleChange}
            />

            <InputBox
              name="last_movement_id"
              type="number"
              label="Last Movement ID (Optional)"
              placeholder=""
              value={formData.last_movement_id}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="p-3 flex-grow shadow-xl form-button-submit flex items-center gap-2"
          >
            <FiCheckCircle />
            Add Inventory Stock
          </button>
        </form>
      </div>
    </PageAnimate>
  );
};

export default AddInventoryStock;

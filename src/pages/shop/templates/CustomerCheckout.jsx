import { useEffect, useState } from 'react';
import PrintIcon from '@mui/icons-material/Print';
import PageAnimate from '../../../components/Animate/PageAnimate';
import { useStore } from '../../../store/store';
// import { fetchProduct, getData, getStuff, placeOrder, getRequest } from '../../../network/api';
import OrderCard from '../../../components/shop/OrderCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ComprehensiveInvoiceTemplate from '../../invoices/templates/Comprehensive';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';
import {
  calculateSubtotal,
  calculateTaxes,
  calculateDiscount,
  calculateTotalAmount,
} from './share/calculations';
import { CustomerSection, OrderDetails } from './share/ShopSections';
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import MouseHoverPopover from '../../../components/core/Explain';
import ShortInvoiceTemplate from '../../invoices/templates/Short';
import { useRoutes } from '../../../hooks/useRoutes';

const CustomerCheckout = () => {
  const { errorPopup, successPopup, selectedProducts, clearSelectedProducts } = useStore();
  const navigate = useNavigate();
  const { getRoute } = useRoutes();

  const [organization, setOrganization] = useState({});
  const [initials, setInitials] = useState('');
  const [payMethods, setPayMethods] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shippings, setShippings] = useState([]);

  // MOCK DATA
  useEffect(() => {
    const demoOrganization = {
      name: "Indiabills",
      address: "123 Billing Street, Tech City",
      gstin: "22AAAAA0000A1Z5",
      contact: "9876543210",
    };
    setOrganization(demoOrganization);
  }, []);

  useEffect(() => {
    const mockInitials = "INV";
    const mockMethods = ["cash", "upi", "card", "credit"];
    setInitials(mockInitials);
    setPayMethods(mockMethods);
  }, []);

  const fetchCustomers = async () => {
    const mockCustomers = [
      { id: "1", name: "John Doe", email: "john@example.com", mobile: "1234567890" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", mobile: "0987654321" },
    ];
    setCustomers(mockCustomers);
  };

  const fetchShipping = async (customerId) => {
    const mockShipping = [
      { addressLine: "123 Main St", city: "Metropolis", state: "Maharashtra", pinCode: "400001" },
    ];
    setShippings(mockShipping);
  };

  useEffect(() => {
    const IDs = Object.keys(selectedProducts);
    if (IDs.length <= 0) return;

    const mockProducts = [
      {
        itemId: "1",
        itemName: "Toner Cartridge",
        unitMRP: 500,
        salePrice: 450,
        purchasePrice: 300,
        discountValue: 20,
        cgst: 9,
        sgst: 9,
      },
      {
        itemId: "2",
        itemName: "A4 Paper Pack",
        unitMRP: 300,
        salePrice: 250,
        purchasePrice: 180,
        discountValue: 10,
        cgst: 6,
        sgst: 6,
      },
    ];

    setProducts(mockProducts);
    fetchCustomers();
  }, [selectedProducts]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ customerName: '', businessName: '', email: '', gender: '', mobile: '', gstin: '' });
  const [newShipping, setNewShipping] = useState({ addressLine: '', city: '', landmark: '', state: '', pinCode: '' });

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: (Number(localStorage.getItem('invoiceCount') || '0000') + 1).toString().padStart(4, '0'),
    invoiceDate: new Date(),
    dueDate: new Date(),
  });

  const [orderData, setOrderData] = useState({
    orderDate: new Date(),
    orderStatus: 'pending',
    totalAmount: 0,
    taxAmount: 0,
    discountApplied: 0,
    shippingCost: 0,
    shippingAddress: '',
    shippingDate: new Date(),
    customerId: '0',
  });

  const [payment, setPayment] = useState({
    paymentMethod: 'cash',
    upi: '',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    cardType: '',
    bankName: '',
    paymentStatus: 'done',
  });

  const [discountType, setDiscountType] = useState('automatic');
  const [manualDiscount, setManualDiscount] = useState(0);
  const [activeDiscounts, setActiveDiscounts] = useState({});
  const [payOffline, setPayOffline] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [ship, setShip] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      setOrderData((prev) => ({ ...prev, customerId: String(selectedCustomer.id) }));
      fetchShipping(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const address = selectedShipping
      ? `${selectedShipping.addressLine}, ${selectedShipping.city}, ${selectedShipping.state}, ${selectedShipping.pinCode}`
      : newShipping.addressLine;
    setOrderData((prev) => ({
      ...prev,
      shippingAddress: isNewCustomer ? newShipping.addressLine : address,
    }));
  }, [selectedShipping, newShipping, isNewCustomer]);

  useEffect(() => {
    const newTotalAmount = calculateTotalAmount(products, selectedProducts);
    const newTaxes = calculateTaxes(products, selectedProducts);
    const newSubtotal = calculateSubtotal(newTotalAmount, newTaxes);
    const newDiscount = calculateDiscount(products, selectedProducts, discountType, manualDiscount, activeDiscounts);
    const newTotalCost = newTotalAmount - newDiscount + Number(orderData.shippingCost);

    const totalPurchasePrice = products.reduce((total, product) => {
      const quantity = selectedProducts[product.itemId]?.quantity || 0;
      const purchasePrice = Number(product.purchasePrice) || 0;
      return total + purchasePrice * quantity;
    }, 0);

    setTaxes(newTaxes);
    setSubtotal(newSubtotal);
    setDiscountValue(newDiscount);
    setTotalCost(newTotalCost);
    setProfitOrLoss(newTotalCost - totalPurchasePrice);
  }, [products, selectedProducts, discountType, manualDiscount, activeDiscounts, orderData.shippingCost]);

  const collectFinalData = async () => {
    const response = { status: 201, message: "Mock order placed successfully!" };

    if (response.status !== 201) {
      errorPopup(`${response.message}`);
      return;
    }

    successPopup('Order placed successfully!');
    clearSelectedProducts();
    navigate(getRoute('/orders'));
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const handlePayClick = () => setIsPaymentModalOpen(true);
  const handlePaymentModalClose = () => setIsPaymentModalOpen(false);

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);
    setPayment((prev) => ({ ...prev, paymentMethod: method }));
  };

  return (
    <PageAnimate nostyle>
      <main className="p-6 w-full flex flex-col gap-8 bg-white rounded-xl">
        <section className="p-4 w-full flex items-center justify-between">
          <button onClick={() => navigate(getRoute(''))} className="text-blue-600 font-medium">
            <ArrowBackIosNewIcon fontSize="small" /> Back to Shop
          </button>
          <div className="flex gap-2 items-center">
            <MouseHoverPopover
              triggerElement={<Button variant="outlined"><ReceiptIcon /></Button>}
              popoverContent={<span className="text-xs">View Invoice</span>}
            />
            <button onClick={handlePayClick} className="p-2 bg-blue-600 text-white rounded-md">
              <PaymentIcon /> Pay
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShip(!ship)}>
              Instant Ship?
              <span className="text-rose-500 font-semibold">{ship ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </section>

        {Object.keys(selectedProducts).length > 0 ? (
          <section className="overflow-x-scroll p-4 text-slate-600">
            <OrderCard products={products} />
          </section>
        ) : (
          <h1 className="text-slate-500 p-4">Nothing to show.</h1>
        )}

        <CustomerSection
          isNewCustomer={isNewCustomer}
          setIsNewCustomer={setIsNewCustomer}
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          newShipping={newShipping}
          setNewShipping={setNewShipping}
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          shippings={shippings}
          discountType={discountType}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
          setOrderData={setOrderData}
          setDiscountType={setDiscountType}
          activeDiscounts={activeDiscounts}
          setActiveDiscounts={setActiveDiscounts}
          products={products}
          manualDiscount={manualDiscount}
          setManualDiscount={setManualDiscount}
          initials={initials}
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
        />

        <OrderDetails
          subtotal={subtotal}
          taxes={taxes}
          discountValue={discountValue}
          totalCost={totalCost}
          profitOrLoss={profitOrLoss}
          orderData={orderData}
          payMethods={payMethods}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          payOffline={payOffline}
          setPayOffline={setPayOffline}
          selectedCustomer={selectedCustomer}
          selectedShipping={selectedShipping}
          newCustomer={newCustomer}
          newShipping={newShipping}
          payment={payment}
          setPayment={setPayment}
        />

        <Modal open={isPaymentModalOpen} onClose={handlePaymentModalClose}>
          <div className="flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 className="text-xl mb-4">Select Payment Method</h2>
              <FormControl fullWidth className="mb-4">
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={paymentMethod}
                  label="Payment Method"
                  onChange={handlePaymentMethodChange}
                >
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                </Select>
              </FormControl>
              <div className="flex justify-end gap-2">
                <Button onClick={handlePaymentModalClose} color="secondary" variant="contained">Cancel</Button>
                <Button onClick={collectFinalData} color="primary" variant="contained">Confirm & Pay</Button>
              </div>
            </div>
          </div>
        </Modal>
      </main>
    </PageAnimate>
  );
};

export default CustomerCheckout;

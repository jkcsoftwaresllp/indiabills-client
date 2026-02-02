import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import styles from './styles/CheckoutPage.module.css';
import CheckoutHeader from './CheckoutHeader';
import AddressSelector from './AddressSelector';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { getCustomerAddresses } from '../../network/api/customersApi';
import { checkoutCart } from '../../network/api/cartApi';

export default function CheckoutPage({ cartItems = [] }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('address'); // address, payment, review
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const addrs = await getCustomerAddresses();
      setAddresses(addrs);
      // Auto-select first default address or first address
      if (addrs.length > 0) {
        const defaultAddr = addrs.find(a => a.is_default);
        const selectedId = defaultAddr?.id || addrs[0]?.id;
        setSelectedBilling(selectedId);
        setSelectedShipping(selectedId);
      }
    } catch (err) {
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressAdded = (newAddressId) => {
    // Refresh addresses after new one is added
    fetchAddresses();
  };

  const handleShippingSelect = (id) => {
    setSelectedShipping(id);
  };

  const handleBillingSelect = (id) => {
    setSelectedBilling(id);
  };

  const handleContinueToPayment = () => {
    if (!selectedShipping || (sameAsBilling && !selectedBilling)) {
      setError('Please select an address');
      return;
    }
    setError('');
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!selectedShipping || !selectedBilling) {
      setError('Please select shipping and billing addresses');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const result = await checkoutCart({
        billing_address_id: selectedBilling,
        shipping_address_id: selectedShipping,
        notes: ''
      });

      if (result.status === 201) {
        navigate('/customer/order-confirmation', {
          state: { orderId: result.data?.order_id }
        });
      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <CheckoutHeader />
        <div className={styles.loader}>
          <Loader size={40} className={styles.spinner} />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <CheckoutHeader />
        <div className={styles.emptyState}>
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/customer/cart')}>
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const shippingAddresses = addresses.filter(a => 
    !a.address_type || a.address_type === 'shipping' || a.address_type === 'other'
  );
  const billingAddresses = addresses.filter(a => 
    !a.address_type || a.address_type === 'billing' || a.address_type === 'other'
  );

  return (
    <div className={styles.page}>
      <CheckoutHeader currentStep={currentStep} onBack={() => navigate('/customer/cart')} />

      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          {currentStep === 'address' && (
            <div className={styles.addressStep}>
              <AddressSelector
                addresses={shippingAddresses}
                selectedAddressId={selectedShipping}
                onAddressSelect={handleShippingSelect}
                onAddressDeleted={fetchAddresses}
                addressType="shipping"
              />

              <div className={styles.billingSection}>
                <div className={styles.billingToggle}>
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                  />
                  <label htmlFor="sameAsBilling">
                    Billing address same as shipping
                  </label>
                </div>

                {!sameAsBilling && (
                  <AddressSelector
                    addresses={billingAddresses}
                    selectedAddressId={selectedBilling}
                    onAddressSelect={handleBillingSelect}
                    onAddressDeleted={fetchAddresses}
                    addressType="billing"
                  />
                )}
              </div>

              <button
                className={styles.continueBtn}
                onClick={handleContinueToPayment}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className={styles.paymentStep}>
              <button
                className={styles.backStepBtn}
                onClick={() => setCurrentStep('address')}
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <PaymentMethod />

              <button
                className={styles.placeOrderBtn}
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting && <Loader size={18} className={styles.spinner} />}
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Order Summary */}
        <aside className={styles.sidebar}>
          <OrderSummary items={cartItems} />
        </aside>
      </div>
    </div>
  );
}

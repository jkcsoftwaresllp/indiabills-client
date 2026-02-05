import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Lock, Check } from 'lucide-react';
import styles from './styles/CheckoutPage.module.css';
import indiaBillsLogo from '../../assets/IndiaBills_logo.png';
import AddressSelector from './AddressSelector';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { getCustomerAddresses } from '../../network/api/customersApi';
import { checkoutCart } from '../../network/api/cartApi';
import { createPayment } from '../../network/api';

export default function CheckoutPage({ cartItems = [] }) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('address'); // address, payment
  const [error, setError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [payment, setPayment] = useState({
    paymentMethod: 'cash',
    upi: '',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
  });

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
    // Validate payment method
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    // Validate payment details based on method
    if (selectedPaymentMethod === 'upi' && !payment.upi) {
      setError('Please enter UPI ID');
      return;
    }

    if (selectedPaymentMethod === 'card' && (!payment.cardNumber || !payment.cardHolderName || !payment.expiryDate || !payment.cvv)) {
      setError('Please fill all card details');
      return;
    }

    if (!selectedShipping || !selectedBilling) {
      setError('Please select shipping and billing addresses');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Create order
      const result = await checkoutCart({
        billing_address_id: selectedBilling,
        shipping_address_id: selectedShipping,
        notes: ''
      });

      if (result.status !== 201) {
        setError(result.error || 'Failed to place order');
        setSubmitting(false);
        return;
      }

      // Extract order data
      const actualData = result.data?.data || result.data || result;
      const orderId = actualData.order_id;
      const customerId = actualData.customer_id;

      if (!orderId || !customerId) {
        setError('Error: Missing order information from checkout');
        setSubmitting(false);
        return;
      }

      // Create payment record
      try {
        const paymentData = {
          order_id: orderId,
          customer_id: customerId,
          payment_method: selectedPaymentMethod,
          payment_status: 'pending',
          amount: cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
          payment_date: new Date().toISOString().split('T')[0],
          upi: selectedPaymentMethod === 'upi' ? payment.upi : undefined,
          card_number: selectedPaymentMethod === 'card' ? payment.cardNumber : undefined,
          card_holder_name: selectedPaymentMethod === 'card' ? payment.cardHolderName : undefined,
          expiry_date: selectedPaymentMethod === 'card' ? payment.expiryDate : undefined,
          cvv: selectedPaymentMethod === 'card' ? payment.cvv : undefined,
        };

        await createPayment(paymentData);
      } catch (error) {
        console.error('Error creating payment:', error);
      }

      // Navigate to orders (same as ProfessionalCheckout)
      navigate('/customer/orders', {
        state: { orderId, newOrder: true }
      });
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.checkoutPage}>
        <header className={styles.checkoutHeader}>
          <div className={styles.headerLeft}>
            <img src={indiaBillsLogo} alt="IndiaBills" className={styles.headerLogo} />
            <div className={styles.headerTitle}>
              <h1>Secure Checkout</h1>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.securityBadge}>
              <Lock size={16} />
              <span>Secure Payment</span>
            </div>
          </div>
        </header>
        <div className={styles.loader}>
          <Loader size={40} className={styles.spinner} />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <header className={styles.checkoutHeader}>
          <div className={styles.headerLeft}>
            <img src={indiaBillsLogo} alt="IndiaBills" className={styles.headerLogo} />
            <div className={styles.headerTitle}>
              <h1>Secure Checkout</h1>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.securityBadge}>
              <Lock size={16} />
              <span>Secure Payment</span>
            </div>
          </div>
        </header>
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
    <div className={styles.checkoutPage}>
      <header className={styles.checkoutHeader}>
        <div className={styles.headerLeft}>
          <img src={indiaBillsLogo} alt="IndiaBills" className={styles.headerLogo} />
          <div className={styles.headerTitle}>
            <h1>Secure Checkout</h1>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.securityBadge}>
            <Lock size={16} />
            <span>Secure Payment</span>
          </div>
        </div>
      </header>

      {/* Back Navigation */}
      <div className={styles.backNavigation}>
        <button 
          className={styles.backBtn}
          onClick={() => navigate('/customer/cart')}
          title="Back to cart"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>
      </div>

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

              <h2>Payment Method</h2>

              <div className={styles.paymentMethods}>
                {[
                  { id: 'cash', name: 'Cash on Delivery', desc: 'Pay when you receive' },
                  { id: 'upi', name: 'UPI', desc: 'Google Pay, PhonePe, etc.' },
                  { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Mastercard' },
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`${styles.paymentMethod} ${selectedPaymentMethod === method.id ? styles.selected : ''}`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className={styles.methodRadio}>
                      {selectedPaymentMethod === method.id && <Check size={16} />}
                    </div>
                    <div className={styles.methodContent}>
                      <p className={styles.methodName}>{method.name}</p>
                      <p className={styles.methodDesc}>{method.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPaymentMethod === 'upi' && (
                <div className={styles.paymentDetails}>
                  <div className={styles.formGroup}>
                    <label>UPI ID</label>
                    <input
                      type="text"
                      value={payment.upi}
                      onChange={(e) => setPayment({ ...payment, upi: e.target.value })}
                      placeholder="username@bankname"
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'card' && (
                <div className={styles.paymentDetails}>
                  <div className={styles.formGroup}>
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Card Holder Name</label>
                    <input
                      type="text"
                      value={payment.cardHolderName}
                      onChange={(e) => setPayment({ ...payment, cardHolderName: e.target.value })}
                      placeholder="Full name on card"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        value={payment.expiryDate}
                        onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>CVV</label>
                      <input
                        type="password"
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

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

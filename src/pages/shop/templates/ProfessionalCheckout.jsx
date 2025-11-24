import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageAnimate from "../../../components/Animate/PageAnimate";
import { useStore } from "../../../store/store";
import { useCart } from "../../../hooks/useCart";
import { useRoutes } from "../../../hooks/useRoutes";
import {
  getCustomerAddresses,
  createCustomerAddress,
} from "../../../network/api/customersApi";
import { createPayment } from "../../../network/api";
import {
  FiArrowLeft,
  FiCheck,
  FiPlus,
  FiX,
  FiTruck,
  FiCreditCard,
  FiMinus,
  FiTrash2,
} from "react-icons/fi";
import "./ProfessionalCheckout.css";

const ProfessionalCheckout = () => {
  const { errorPopup, successPopup } = useStore();
  const { cartItems, checkout, loading: cartLoading, loadCart, removeItemFromCart } = useCart();
  const navigate = useNavigate();
  const { getRoute } = useRoutes();

  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart, 2: Address, 3: Payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pin_code: "",
    contact_phone: "",
    contact_email: "",
    address_type: "shipping",
  });

  const [payment, setPayment] = useState({
    paymentMethod: "cash",
    upi: "",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [quantities, setQuantities] = useState({});

  // Initialize quantities from cart items
  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.product_id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // Fetch cart and addresses on component mount
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Load cart data first
        await loadCart();
        
        // Then fetch addresses
        setLoadingAddresses(true);
        const data = await getCustomerAddresses();
        setAddresses(Array.isArray(data) ? data : []);
        if (data && data.length > 0) {
          setSelectedAddress(data[0]);
        }
      } catch (error) {
        console.error("Failed to initialize checkout:", error);
        errorPopup("Failed to load checkout page. Please try again.");
      } finally {
        setLoadingAddresses(false);
        setPageLoading(false);
      }
    };

    initializeCheckout();
  }, []);

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let taxes = 0;

    cartItems.forEach((item) => {
      const qty = quantities[item.product_id] || item.quantity;
      const itemTotal = item.price_at_addition * qty;
      subtotal += itemTotal;

      // Simple tax calculation (adjust as needed)
      const tax = (itemTotal * 0.18) / 100;
      taxes += tax;
    });

    const total = subtotal + taxes;

    return { subtotal, taxes, total };
  };

  const { subtotal, taxes, total } = calculateTotals();

  // Handle quantity change
  const updateQuantity = (productId, change) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const newQty = Math.max(1, current + change);
      return { ...prev, [productId]: newQty };
    });
  };

  // Handle remove item from cart
  const handleRemoveFromCart = async (productId) => {
    await removeItemFromCart(productId);
  };

  // Handle add address
  const handleAddAddress = async () => {
    if (
      !newAddress.address_line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pin_code
    ) {
      errorPopup("Please fill all required fields");
      return;
    }

    try {
      await createCustomerAddress(newAddress);
      successPopup("Address added successfully!");
      
      // Refresh addresses
      const data = await getCustomerAddresses();
      setAddresses(Array.isArray(data) ? data : []);
      
      // Select the new address
      if (data && data.length > 0) {
        setSelectedAddress(data[data.length - 1]);
      }
      
      setNewAddress({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pin_code: "",
        contact_phone: "",
        contact_email: "",
        address_type: "shipping",
      });
      setShowAddAddressForm(false);
    } catch (error) {
      errorPopup(error.message || "Failed to add address");
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      errorPopup("Please select a payment method");
      return;
    }

    if (selectedPaymentMethod === "upi" && !payment.upi) {
      errorPopup("Please enter UPI ID");
      return;
    }

    if (
      selectedPaymentMethod === "card" &&
      (!payment.cardNumber ||
        !payment.cardHolderName ||
        !payment.expiryDate ||
        !payment.cvv)
    ) {
      errorPopup("Please fill all card details");
      return;
    }

    if (!selectedAddress) {
      errorPopup("Please select a delivery address");
      return;
    }

    try {
      // Validate quantities before checkout
      const hasValidQuantities = cartItems.every(
        item => (quantities[item.product_id] || item.quantity) > 0
      );

      if (!hasValidQuantities) {
        errorPopup("All items must have a quantity greater than 0");
        return;
      }

      const result = await checkout({
        billing_address_id: selectedAddress.id || selectedAddress.address_id,
        shipping_address_id: selectedAddress.id || selectedAddress.address_id,
        notes: "",
      });

      if (!result.success) {
        errorPopup(result.error);
        return;
      }

      // Extract actual data from double-nested response
      const actualData = result.data?.data || result.data || result;
      const orderId = actualData.order_id;
      const customerId = actualData.customer_id;

      if (!orderId || !customerId) {
        errorPopup("Error: Missing order information from checkout");
        return;
      }

      // Create payment record
      try {
        const paymentData = {
          order_id: orderId,
          customer_id: customerId,
          payment_method: selectedPaymentMethod,
          payment_status: "pending",
          amount: total,
          payment_date: new Date().toISOString().split("T")[0],
        };

        await createPayment(paymentData);
      } catch (error) {
        console.error("Error creating payment:", error);
      }

      successPopup(
        "Order placed successfully! Payment is pending confirmation."
      );

      // Store order in localStorage
      const newOrder = {
        orderId: orderId,
        orderDate: new Date().toISOString(),
        totalAmount: total.toString(),
        orderStatus: "pending",
        paymentStatus: "pending",
        items: cartItems.map((item) => ({
          itemId: item.product_id,
          itemName: item.name,
          quantity: quantities[item.product_id] || item.quantity,
          salePrice: item.price_at_addition,
        })),
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("customerOrders") || "[]"
      );
      localStorage.setItem(
        "customerOrders",
        JSON.stringify([newOrder, ...existingOrders])
      );

      navigate(getRoute("/orders"));
    } catch (error) {
      errorPopup("Failed to place order: " + error.message);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    const parts = [
      addr.address_line1,
      addr.address_line2,
      addr.city,
      addr.state,
      addr.pin_code,
    ];
    return parts.filter((p) => p).join(", ");
  };

  // Show loading state while page is initializing
  if (pageLoading) {
    return (
      <PageAnimate nostyle>
        <main className="checkout-container">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </main>
      </PageAnimate>
    );
  }

  // Redirect if cart is empty after loading
  if (cartItems.length === 0) {
    return (
      <PageAnimate nostyle>
        <main className="checkout-container">
          <div className="checkout-header">
            <button
              className="back-button"
              onClick={() => navigate(getRoute(""))}
            >
              <FiArrowLeft /> Back to Shop
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Cart is Empty</h2>
            <p className="text-gray-600">Add items to your cart before checking out</p>
            <button
              className="btn-primary"
              onClick={() => navigate(getRoute(""))}
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </PageAnimate>
    );
  }

  return (
    <PageAnimate nostyle>
      <main className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button
            className="back-button"
            onClick={() => navigate(getRoute(""))}
          >
            <FiArrowLeft /> Back to Shop
          </button>
          <h1 className="checkout-title">Secure Checkout</h1>
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
              <span>1</span>
              <span>Cart</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
              <span>2</span>
              <span>Address</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
              <span>3</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="checkout-content">
          {/* Left Section - Form */}
          <div className="checkout-form">
            {/* Step 1: Cart */}
            {currentStep === 1 && (
              <div className="step-content">
                <h2>Order Summary</h2>
                <div className="cart-items">
                   {cartItems.map((item) => (
                     <div key={item.product_id} className="cart-item">
                       <div className="item-info">
                         <h3>{item.name}</h3>
                         <p className="item-price">₹{item.price_at_addition}</p>
                       </div>
                       <div className="quantity-control">
                         <button
                           onClick={() =>
                             updateQuantity(item.product_id, -1)
                           }
                         >
                           <FiMinus />
                         </button>
                         <input
                           type="number"
                           value={quantities[item.product_id] || item.quantity}
                           readOnly
                         />
                         <button
                           onClick={() =>
                             updateQuantity(item.product_id, 1)
                           }
                         >
                           <FiPlus />
                         </button>
                       </div>
                       <div className="item-total">
                         ₹
                         {(
                           item.price_at_addition *
                           (quantities[item.product_id] || item.quantity)
                         ).toFixed(2)}
                       </div>
                       <button
                         className="remove-btn"
                         onClick={() => handleRemoveFromCart(item.product_id)}
                         title="Remove item from cart"
                       >
                         <FiTrash2 />
                       </button>
                     </div>
                   ))}
                 </div>

                <div className="step-actions">
                  <button className="btn-primary" onClick={() => setCurrentStep(2)}>
                    Continue to Address
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="step-content">
                <h2>Shipping Address</h2>

                {!showAddAddressForm ? (
                  <>
                    {loadingAddresses ? (
                      <p className="loading">Loading addresses...</p>
                    ) : addresses.length > 0 ? (
                      <div className="addresses-list">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`address-card ${
                              selectedAddress?.id === addr.id ? "selected" : ""
                            }`}
                            onClick={() => setSelectedAddress(addr)}
                          >
                            <div className="address-radio">
                              {selectedAddress?.id === addr.id && (
                                <FiCheck />
                              )}
                            </div>
                            <div className="address-content">
                              <p className="address-text">
                                {formatAddress(addr)}
                              </p>
                              {addr.contact_phone && (
                                <p className="address-phone">
                                  📱 {addr.contact_phone}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-addresses">
                        No saved addresses found
                      </p>
                    )}

                    <button
                      className="btn-secondary"
                      onClick={() => setShowAddAddressForm(true)}
                    >
                      <FiPlus /> Add New Address
                    </button>
                  </>
                ) : (
                  <div className="add-address-form">
                    <div className="form-group">
                      <label>Address Line 1 *</label>
                      <input
                        type="text"
                        value={newAddress.address_line1}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address_line1: e.target.value,
                          })
                        }
                        placeholder="Street address"
                      />
                    </div>

                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input
                        type="text"
                        value={newAddress.address_line2}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address_line2: e.target.value,
                          })
                        }
                        placeholder="Apartment, suite, etc."
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                          placeholder="City"
                        />
                      </div>

                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              state: e.target.value,
                            })
                          }
                          placeholder="State"
                        />
                      </div>

                      <div className="form-group">
                        <label>Pin Code *</label>
                        <input
                          type="text"
                          value={newAddress.pin_code}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              pin_code: e.target.value,
                            })
                          }
                          placeholder="Pin code"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Contact Phone</label>
                        <input
                          type="tel"
                          value={newAddress.contact_phone}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              contact_phone: e.target.value,
                            })
                          }
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>

                      <div className="form-group">
                        <label>Contact Email</label>
                        <input
                          type="email"
                          value={newAddress.contact_email}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              contact_email: e.target.value,
                            })
                          }
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => setShowAddAddressForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleAddAddress}
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                <div className="step-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedAddress && !showAddAddressForm}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="step-content">
                <h2>Payment Method</h2>

                <div className="payment-methods">
                  {[
                    {
                      id: "cash",
                      name: "Cash on Delivery",
                      desc: "Pay when you receive",
                    },
                    { id: "upi", name: "UPI", desc: "Google Pay, PhonePe, etc." },
                    { id: "card", name: "Credit/Debit Card", desc: "Visa, Mastercard" },
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`payment-method ${
                        selectedPaymentMethod === method.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="method-radio">
                        {selectedPaymentMethod === method.id && <FiCheck />}
                      </div>
                      <div className="method-content">
                        <p className="method-name">{method.name}</p>
                        <p className="method-desc">{method.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPaymentMethod === "upi" && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        value={payment.upi}
                        onChange={(e) =>
                          setPayment({ ...payment, upi: e.target.value })
                        }
                        placeholder="username@bankname"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "card" && (
                  <div className="payment-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        value={payment.cardNumber}
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            cardNumber: e.target.value,
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Holder Name</label>
                      <input
                        type="text"
                        value={payment.cardHolderName}
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            cardHolderName: e.target.value,
                          })
                        }
                        placeholder="Full name on card"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          value={payment.expiryDate}
                          onChange={(e) =>
                            setPayment({
                              ...payment,
                              expiryDate: e.target.value,
                            })
                          }
                          placeholder="MM/YY"
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="password"
                          value={payment.cvv}
                          onChange={(e) =>
                            setPayment({ ...payment, cvv: e.target.value })
                          }
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="step-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                  <button
                    className="btn-primary btn-pay"
                    onClick={handlePayment}
                    disabled={cartLoading}
                  >
                    <FiCreditCard />
                    {cartLoading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Order Summary */}
          <aside className="checkout-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.product_id} className="summary-item">
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">
                      Qty: {quantities[item.product_id] || item.quantity}
                    </p>
                  </div>
                  <p className="item-cost">
                    ₹
                    {(
                      item.price_at_addition *
                      (quantities[item.product_id] || item.quantity)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-calculation">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Tax (18%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="calc-row shipping">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">₹{total.toFixed(2)}</span>
            </div>

            {selectedAddress && currentStep >= 2 && (
              <div className="summary-address">
                <p className="address-label">Delivery Address</p>
                <p className="address-detail">{formatAddress(selectedAddress)}</p>
                {selectedAddress.contact_phone && (
                  <p className="address-phone">📱 {selectedAddress.contact_phone}</p>
                )}
              </div>
            )}
          </aside>
        </div>
      </main>
    </PageAnimate>
  );
};

export default ProfessionalCheckout;

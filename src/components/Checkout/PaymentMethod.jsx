import { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import styles from './styles/PaymentMethod.module.css';

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState('card');

  return (
    <div className={styles.container}>
      <h3>Select Payment Method</h3>
      <p className={styles.subtitle}>Choose how you'd like to pay</p>

      <div className={styles.methodsList}>
        {/* Credit/Debit Card */}
        <div
          className={`${styles.methodCard} ${selectedMethod === 'card' ? styles.selected : ''}`}
          onClick={() => setSelectedMethod('card')}
        >
          <div className={styles.radioCircle}>
            {selectedMethod === 'card' && <div className={styles.checkedDot} />}
          </div>
          <div className={styles.methodContent}>
            <CreditCard size={24} />
            <div>
              <h4>Credit/Debit Card</h4>
              <p>Visa, Mastercard, Rupay</p>
            </div>
          </div>
        </div>

        {/* Razorpay Payment */}
        <div
          className={`${styles.methodCard} ${selectedMethod === 'razorpay' ? styles.selected : ''}`}
          onClick={() => setSelectedMethod('razorpay')}
        >
          <div className={styles.radioCircle}>
            {selectedMethod === 'razorpay' && <div className={styles.checkedDot} />}
          </div>
          <div className={styles.methodContent}>
            <DollarSign size={24} />
            <div>
              <h4>Razorpay Secure Checkout</h4>
              <p>Cards, UPI, Net Banking</p>
            </div>
          </div>
        </div>
      </div>

      {selectedMethod === 'card' && (
        <div className={styles.cardForm}>
          <div className={styles.field}>
            <label>Cardholder Name</label>
            <input type="text" placeholder="John Doe" />
          </div>

          <div className={styles.field}>
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>

          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label>Expiry Date</label>
              <input type="text" placeholder="MM/YY" maxLength="5" />
            </div>
            <div className={styles.field}>
              <label>CVV</label>
              <input type="text" placeholder="123" maxLength="3" />
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'razorpay' && (
        <div className={styles.razorpayInfo}>
          <p>You will be redirected to Razorpay's secure payment gateway to complete your payment.</p>
        </div>
      )}

      <div className={styles.security}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Your payment information is encrypted and secure</span>
      </div>
    </div>
  );
}

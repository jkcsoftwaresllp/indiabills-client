import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import styles from './styles/AddressForm.module.css';
import { createCustomerAddress } from '../../network/api/customersApi';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function AddressForm({ onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    label: 'Home',
    address_type: 'shipping',
    address_line1: '',
    address_line2: '',
    landmark: '',
    city: '',
    state: '',
    pin_code: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    is_default: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.address_line1.trim()) return 'Address line 1 is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state) return 'State is required';
    if (!formData.pin_code.trim()) return 'Pin code is required';
    if (!/^[0-9]{6}$/.test(formData.pin_code)) return 'Pin code must be 6 digits';
    if (formData.contact_phone && !/^[0-9]{10}$/.test(formData.contact_phone.replace(/\s/g, ''))) {
      return 'Phone must be 10 digits';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await createCustomerAddress(formData);
      if (response?.data) {
        onSubmit(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h4>Add New Address</h4>
        <button type="button" className={styles.closeBtn} onClick={onCancel}>
          <X size={20} />
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.twoCol}>
        <div className={styles.field}>
          <label>Address Label</label>
          <select name="label" value={formData.label} onChange={handleChange}>
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Address Type</label>
          <select name="address_type" value={formData.address_type} onChange={handleChange}>
            <option value="shipping">Shipping</option>
            <option value="billing">Billing</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label>Full Name *</label>
        <input
          type="text"
          name="contact_name"
          value={formData.contact_name}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </div>

      <div className={styles.field}>
        <label>Address Line 1 *</label>
        <input
          type="text"
          name="address_line1"
          value={formData.address_line1}
          onChange={handleChange}
          placeholder="House No., Building Name"
        />
      </div>

      <div className={styles.field}>
        <label>Address Line 2</label>
        <input
          type="text"
          name="address_line2"
          value={formData.address_line2}
          onChange={handleChange}
          placeholder="Road name, Area, Colony"
        />
      </div>

      <div className={styles.field}>
        <label>Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Near hospital, ATM, etc."
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.field}>
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <div className={styles.field}>
          <label>State *</label>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.field}>
          <label>Pin Code *</label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            placeholder="100000"
            maxLength="6"
          />
        </div>
        <div className={styles.field}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="9876543210"
            maxLength="10"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input
          type="email"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleChange}
          placeholder="john@example.com"
        />
      </div>

      <div className={styles.checkbox}>
        <input
          type="checkbox"
          id="default"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
        />
        <label htmlFor="default">Set as default address</label>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading && <Loader size={16} className={styles.spinner} />}
          {loading ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}

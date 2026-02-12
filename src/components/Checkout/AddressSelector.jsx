import { useState } from 'react';
import { MapPin, Plus, Check, Trash2, Loader } from 'lucide-react';
import styles from './styles/AddressSelector.module.css';
import AddressForm from './AddressForm';
import { deleteCustomerAddress } from '../../network/api/customersApi';

export default function AddressSelector({ 
  addresses = [], 
  selectedAddressId = null,
  onAddressSelect,
  onAddressDeleted,
  addressType = 'shipping' // 'shipping' or 'billing'
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddressAdded, setNewAddressAdded] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const handleAddressAdded = (newAddress) => {
    setNewAddressAdded(true);
    setShowAddForm(false);
    onAddressSelect(newAddress.id);
    // Refresh addresses list
    onAddressDeleted?.();
    // Reset flag after a moment
    setTimeout(() => setNewAddressAdded(false), 1500);
  };

  const handleDeleteAddress = async (e, addressId) => {
    e.stopPropagation();
    setDeleteError('');
    
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setDeletingId(addressId);
    try {
      await deleteCustomerAddress(addressId);
      // Refresh the addresses list
      onAddressDeleted?.();
    } catch (err) {
      setDeleteError('Failed to delete address');
      console.error('Delete address error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MapPin size={20} />
        <h3>{addressType === 'shipping' ? 'Shipping Address' : 'Billing Address'}</h3>
      </div>

      {deleteError && (
        <div className={styles.errorAlert}>{deleteError}</div>
      )}

      {addresses.length > 0 && !showAddForm && (
        <div className={styles.addressList}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selected : ''}`}
              onClick={() => onAddressSelect(addr.id)}
            >
              <div className={styles.radioCircle}>
                {selectedAddressId === addr.id && <Check size={16} />}
              </div>
              <div className={styles.addressContent}>
                <div className={styles.nameRow}>
                  <p className={styles.name}>{addr.contact_name || 'No name'}</p>
                  <div className={styles.addressLabel}>
                    {addr.label && <span className={styles.badge}>{addr.label}</span>}
                    {addr.is_default && <span className={styles.badgeDefault}>Default</span>}
                  </div>
                </div>
                <p className={styles.address}>
                  {addr.address_line1}
                  {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                </p>
                <p className={styles.city}>
                  {addr.city}, {addr.state} {addr.pin_code}
                </p>
                {addr.contact_phone && <p className={styles.phone}>{addr.contact_phone}</p>}
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteAddress(e, addr.id)}
                disabled={deletingId === addr.id}
                title="Delete address"
              >
                {deletingId === addr.id ? (
                  <Loader size={16} className={styles.spinner} />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {!showAddForm && (
        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          <Plus size={18} />
          Add New Address
        </button>
      )}

      {showAddForm && (
        <AddressForm
          onSubmit={handleAddressAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {newAddressAdded && (
        <div className={styles.successMsg}>✓ Address added successfully</div>
      )}
    </div>
  );
}

// client/src/components/AddExpenseModal.tsx
import React, { useState } from 'react';
import { postData } from '../../network/api';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onExpenseAdded }) => {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleAddExpense = async () => {
    if (!reason || !amount) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await postData('/reports/expenses', {
        reason,
        amount: parseFloat(amount),
        remarks,
      });
      onExpenseAdded();
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Expense</h2>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks"
        />
        <button onClick={handleAddExpense}>Add Expense</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddExpenseModal;
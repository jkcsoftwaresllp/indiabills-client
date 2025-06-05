import React, { useState, useEffect } from "react";
import { postData } from "../../network/api";
import { useStore } from "../../store/store";
import styles from './styles/DebitModal.module.css';

const DebitModal = ({ isOpen, onClose, onDebitSuccess, creditId }) => {
  const { successPopup, errorPopup } = useStore();

  // Function to generate debit number
  const generateDebitNumber = (date) => {
    const [year, month, day] = date.split("-");
    const shortYear = year.slice(2);
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `DEB${shortYear}${month}${day}${randomNum}`;
  };

  const curr = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    amount: "",
    debitMethod: "cash",
    debitNumber: generateDebitNumber(curr),
    reason: "",
    remarks: "",
    amountDate: curr,
  });

  // Update debit number whenever date changes or when component mounts
  useEffect(() => {
    if (isOpen) {
      const newDebitNumber = generateDebitNumber(formData.amountDate);
      setFormData((prev) => ({
        ...prev,
        debitNumber: newDebitNumber,
      }));
    }
  }, [formData.amountDate, isOpen]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const newDebitNumber = generateDebitNumber(newDate);
    setFormData((prev) => ({
      ...prev,
      amountDate: newDate,
      debitNumber: newDebitNumber,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postData(`/reports/debit/${creditId}`, {
        amount: Number(formData.amount),
        amountType: "debit",
        debitMethod: formData.debitMethod,
        debitNumber: formData.debitNumber,
        reason: formData.reason,
        remarks: formData.remarks,
        amountDate: new Date(formData.amountDate).toISOString(),
      });

      successPopup("Debit processed successfully");
      onDebitSuccess();
      onClose();
    } catch (error) {
      console.error("Error processing debit:", error);
      errorPopup("Error processing debit");
    }
  };

  if (!isOpen) return null;

  return (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <h2 className={styles.heading}>Process Debit</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Credit ID</label>
          <input
            type="text"
            value={creditId}
            disabled
            className={styles.input}
          />
        </div>

        <div>
          <label className={styles.label}>Debit Amount *</label>
          <input
            type="number"
            step="0.01"
            required
            className={styles.input}
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>

        <div>
          <label className={styles.label}>Debit Method *</label>
          <select
            required
            className={styles.select}
            value={formData.debitMethod}
            onChange={(e) =>
              setFormData({ ...formData, debitMethod: e.target.value })
            }
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="check">Check</option>
          </select>
        </div>

        <div>
          <label className={styles.label}>Debit No.</label>
          <input
            type="text"
            className={styles.input}
            value={formData.debitNumber}
            readOnly
          />
        </div>

        <div>
          <label className={styles.label}>Amount Date *</label>
          <input
            type="date"
            required
            className={styles.input}
            value={formData.amountDate}
            onChange={handleDateChange}
          />
        </div>

        <div>
          <label className={styles.label}>Reason</label>
          <input
            type="text"
            className={styles.input}
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
          />
        </div>

        <div>
          <label className={styles.label}>Remarks</label>
          <textarea
            className={styles.textarea}
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            Process Debit
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default DebitModal;

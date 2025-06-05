import { useState, useEffect } from "react";
import { postData } from "../../network/api";
import dayjs from "dayjs";
import { TextInput } from "../../components/FormComponent/TextInput";
import styles from "./styles/SettleCreditsModal.module.css";


const SettleCreditModal = ({
  onClose,
  onSettleSuccess,
  customerId,
  creditData,
}) => {
  // Function to generate debit number
  const generateDebitNumber = (date) => {
    const [year, month, day] = date.split("-");
    const shortYear = year.slice(2);
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `${shortYear}${month}${day}${randomNum}`;
  };

  const curr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    debitAmount: 0,
    debitMethod: "cash",
    debitNumber: generateDebitNumber(curr),
    reason: "",
    remarks: "",
    amountDate: curr,
  });

  const [isAdvancePayment, setIsAdvancePayment] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getEligibleRows = async () => {
      try {
        // First, get all credits and their corresponding debits
        const creditMap = creditData.reduce((acc, credit) => {
          if (credit.amountType === "credit") {
            // Initialize or update credit amount for this invoice
            if (!acc[credit.invoiceId]) {
              acc[credit.invoiceId] = {
                creditId: credit.creditId,
                invoiceId: credit.invoiceId,
                invoiceNumber: credit.invoiceNumber,
                creditAmount: Number(credit.amount),
                debitAmount: 0,
                dateAdded: credit.dateAdded,
                selected: false,
              };
            }
          } else if (credit.amountType === "debit") {
            // Subtract debit amount if exists
            if (acc[credit.invoiceId]) {
              acc[credit.invoiceId].debitAmount += Number(credit.amount);
            }
          }
          return acc;
        }, {});

        // Filter and transform to rows
        const eligibleRows = Object.values(creditMap)
          .filter((row) => {
            const remainingBalance = row.creditAmount - row.debitAmount;
            return remainingBalance > 0; // Only include if there's remaining balance
          })
          .map((row) => ({
            selected: false,
            creditId: row.creditId,
            invoiceId: row.invoiceId,
            invoiceNumber: row.invoiceNumber,
            balance: row.creditAmount - row.debitAmount, // Calculate remaining balance
            dateAdded: row.dateAdded,
          }))
          .sort(
            (a, b) =>
              dayjs(a.dateAdded).valueOf() - dayjs(b.dateAdded).valueOf(),
          );

        setRows(eligibleRows);
      } catch (error) {
        console.error("Error processing eligible rows:", error);
      }
    };

    if (creditData?.length > 0) {
      getEligibleRows();
    }
  }, [creditData]);

  const handleAutoAllocate = () => {
    if (isAdvancePayment) return;

    let remaining = formData.debitAmount;
    const updated = rows.map((r) => {
      let selected = false;
      if (remaining > 0) {
        selected = true;
        const used = Math.min(r.balance, remaining);
        remaining -= used;
      }
      return { ...r, selected };
    });
    setRows(updated);
  };

  const handleSubmit = async () => {
    const selectedRows = rows.filter((r) => r.selected);

    const data = {
      debitMethod: formData.debitMethod,
      debitNumber: formData.debitNumber,
      debitAmount: formData.debitAmount,
      customerId,
      reason: formData.reason,
      remarks: formData.remarks,
      amountDate: formData.amountDate,
      amountType: "debit",
      allocations: selectedRows.map(({ invoiceId }) => invoiceId),
    };

    try {
      if (isAdvancePayment) {
        // Submit as advance payment
        await postData(`reports/debit/advance`, data);
      } else {
        // Submit as invoice settlement
        const selectedRows = rows.filter((r) => r.selected);
        await postData(`reports/debit/submit`, {
          ...data,
          allocations: selectedRows.map(({ invoiceId }) => invoiceId),
        });
      }
      onSettleSuccess();
      onClose();
    } catch (err) {
      console.error("Error settling credits:", err);
    }
  };

 return (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <h2 className={styles.header}>Settle Credits</h2>

      <div className="space-y-4">
        <div className={styles.field}>
          <label className={styles.label}>Debit Amount *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.debitAmount}
            onChange={(e) =>
              setFormData({ ...formData, debitAmount: Number(e.target.value) })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              checked={!isAdvancePayment}
              onChange={() => setIsAdvancePayment(false)}
            />
            Settle Invoices
          </label>
          <label>
            <input
              type="radio"
              checked={isAdvancePayment}
              onChange={() => setIsAdvancePayment(true)}
            />
            Advance Payment
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Debit Method *</label>
          <select
            value={formData.debitMethod}
            onChange={(e) =>
              setFormData({ ...formData, debitMethod: e.target.value })
            }
            className={styles.select}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="check">Check</option>
          </select>
        </div>

        <div className={styles.field}>
          <TextInput
            label="Debit Number"
            name="debit"
            value={formData.debitNumber}
            onChange={(e) =>
              setFormData({ ...formData, debitNumber: e.target.value })
            }
            startText="DEB-"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Amount Date *</label>
          <input
            type="date"
            required
            value={formData.amountDate}
            onChange={(e) =>
              setFormData({ ...formData, amountDate: e.target.value })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Reason</label>
          <input
            type="text"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            className={styles.textarea}
            rows={3}
          />
        </div>

        {!isAdvancePayment && (
          <>
            <button
              onClick={handleAutoAllocate}
              className={styles.autoAllocateBtn}
            >
              Auto-Allocate Oldest First
            </button>

            <div className={styles.creditList}>
              <h3 className="font-medium mb-2">Select Credits to Settle</h3>
              {rows.length === 0 ? (
                <p className="text-sm text-gray-600">No unpaid credits.</p>
              ) : (
                rows.map(({ creditId, invoiceNumber, balance, selected }, idx) => (
                  <label key={creditId} className={styles.creditLabel}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[idx].selected = e.target.checked;
                        setRows(newRows);
                      }}
                    />
                    <span>Credit #{creditId}</span>
                    <span className="text-gray-600">
                      INV-{invoiceNumber} / ₹{balance.toFixed(2)}
                    </span>
                  </label>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  </div>
);
};

export default SettleCreditModal;

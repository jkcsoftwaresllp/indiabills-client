import React, { useState, useEffect } from "react";
import { postData } from "../../network/api";
import { useStore } from "../../store/store";

interface DebitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDebitSuccess: () => void;
  creditId: number;
}

const DebitModal: React.FC<DebitModalProps> = ({
  isOpen,
  onClose,
  onDebitSuccess,
  creditId,
}) => {
  const { successPopup, errorPopup, user } = useStore();

  // Function to generate debit number
  const generateDebitNumber = (date: string) => {
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
  }, [formData.amountDate, isOpen]); // Add dependencies

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const newDebitNumber = generateDebitNumber(newDate);
    setFormData((prev) => ({
      ...prev,
      amountDate: newDate,
      debitNumber: newDebitNumber,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Process Debit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit ID
            </label>
            <input
              type="text"
              value={creditId}
              disabled
              className="w-full p-2 border rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debit Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debit Method *
            </label>
            <select
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debit No.
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md bg-gray-50"
              value={formData.debitNumber}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Date *
            </label>
            <input
              type="date"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.amountDate}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Process Debit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DebitModal;

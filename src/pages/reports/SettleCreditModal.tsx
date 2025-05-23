import { useState, useEffect } from "react";
import { postData } from "../../network/api";
import dayjs from "dayjs";
import { TextInput } from "../../components/FormComponent/TextInput";

interface CreditRow {
  creditId: number;
  invoiceNumber: number;
  invoiceId: number;
  balance: number;
  dateAdded: string;
}

interface Props {
  onClose: () => void;
  onSettleSuccess: () => void;
  customerId: number | string;
  creditData: CreditRow[];
}

const SettleCreditModal = ({
  onClose,
  onSettleSuccess,
  customerId,
  creditData,
}: Props) => {
  // Function to generate debit number
  const generateDebitNumber = (date: string) => {
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
    debitMethod: "cash" as "cash" | "card" | "upi" | "check",
    debitNumber: generateDebitNumber(curr),
    reason: "",
    remarks: "",
    amountDate: curr,
  });

  const [isAdvancePayment, setIsAdvancePayment] = useState(false);
  const [rows, setRows] = useState<
    {
      selected: boolean;
      creditId: number;
      invoiceId: number;
      invoiceNumber: number;
      balance: number;
    }[]
  >([]);

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

    // console.log(data);

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
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-h-[500px] overflow-y-auto max-w-lg">
        <h2 className="text-xl font-semibold mb-6">Settle Credits</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debit Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.debitAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  debitAmount: Number(e.target.value),
                })
              }
              className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isAdvancePayment}
                onChange={() => setIsAdvancePayment(false)}
                className="mr-2"
              />
              Settle Invoices
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={isAdvancePayment}
                onChange={() => setIsAdvancePayment(true)}
                className="mr-2"
              />
              Advance Payment
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Debit Method *
            </label>
            <select
              value={formData.debitMethod}
              onChange={(e) =>
                setFormData({ ...formData, debitMethod: e.target.value as any })
              }
              className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="check">Check</option>
            </select>
          </div>

          <div>
            <TextInput
              label="Debit Number"
              name="debit"
              value={formData.debitNumber}
              onChange={(e) => {
                //sphagetti code; will fix it later...
                const handleChange = (e) => {
                  setFormData({ ...formData, debitNumber: e.target.value });
                };
                return handleChange(e);
              }}
              startText="DEB-"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Date *
            </label>
            <input
              type="date"
              required
              value={formData.amountDate}
              onChange={(e) =>
                setFormData({ ...formData, amountDate: e.target.value })
              }
              className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {!isAdvancePayment && (
            <>
              <button
                onClick={handleAutoAllocate}
                className="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition"
              >
                Auto-Allocate Oldest First
              </button>

              <div className="max-h-64 overflow-y-auto border rounded-md p-4">
                <h3 className="font-medium mb-2">Select Credits to Settle</h3>
                {rows.length === 0 ? (
                  <p className="text-sm text-gray-600">No unpaid credits.</p>
                ) : (
                  rows.map(
                    ({ creditId, invoiceNumber, balance, selected }, idx) => (
                      <label
                        key={creditId}
                        className="flex items-center space-x-2 py-2 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[idx].selected = e.target.checked;
                            setRows(newRows);
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>Credit #{creditId}</span>
                        <span className="text-gray-600">
                          INV-{invoiceNumber} / ₹{balance.toFixed(2)}
                        </span>
                      </label>
                    ),
                  )
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleCreditModal;

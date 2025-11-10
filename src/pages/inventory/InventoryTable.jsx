import { FiChevronDown } from 'react-icons/fi';
import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const thClass = `p-4 border-b border-gray-200 bg-primary text-slate-200 mb-2 whitespace-nowrap`;

const InventoryTable = ({ entries }) => {
  return (
    <div className="overflow-x-auto p-4 rounded-xl">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
        <thead className="bg-gray-100 rounded-xl">
          <tr>
            <th className={`${thClass} rounded-tl-lg`}> Batch ID </th>
            <th className={`${thClass}`}> Batch Number </th>
            <th className={`${thClass}`}> Items </th>
            <th className={`${thClass}`}> Batch Price </th>
            <th className={`${thClass}`}> Status </th>
            <th className={`${thClass}`}> Supplier Name </th>
            <th className={`${thClass} rounded-tr-lg`}> Entry Date </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <React.Fragment key={index}>
              <tr className="bg-white hover:bg-gray-50 transition-colors">
                <td className="p-4 border-b border-gray-200 whitespace-nowrap font-semibold "> {entry.batchId} </td>
                <td className="p-4 border-b border-gray-200 whitespace-nowrap"> {entry.batchNumber} </td>
                <td className="p-4 border-b border-gray-200 whitespace-nowrap">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      const el = document.getElementById(`items-${index}`);
                      if (el) el.classList.toggle("hidden");
                    }}>
                    {entry.subBatches.length}
                    {entry.subBatches.length > 1 ? "Items" : "Item"}
                    {entry.subBatches.length > 0 ? (
                      <FiChevronDown />
                    ) : (
                      <>
                      </>
                    )}
                  </button>
                </td>
                <td className="p-4 border-b border-gray-200 whitespace-nowrap"> {entry.batchPrice} </td>
                <td className="p-4 border-b border-gray-200 whitespace-nowrap">
                  <span className="py-1 px-3 bg-emerald-50 border border-emerald-300 rounded-full capitalize text-emerald-800"> {entry.status} </span>
                </td>
                <td className="p-4 border-b border-gray-200 whitespace-nowrap"> {entry.supplierName} </td>
                <td className="p-4 border-b border-gray-200 whitespace-nowrap"> {formatDate(entry.entryDate)} </td>
              </tr>
              <tr id={`items-${index}`} className="hidden">
                <td colSpan={6} className="p-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    {entry.subBatches.map((subBatch) => (
                      <div
                        key={subBatch.subBatchId}
                        className="p-2 border-b border-gray-200 capitalize"
                      >
                        <div> <strong>Item Name:</strong> {subBatch.itemName} </div>
                        <div> <strong>Quantity:</strong> {subBatch.quantity} </div>
                        <div> <strong>Per Crate Quantity:</strong>{" "} {subBatch.packSize} </div>
                        <div> <strong>Unit Price:</strong> ₹ {subBatch.recordUnitPrice.toFixed(2)} </div>
                        <div>
                          <strong>Discount:</strong>
                          {subBatch.discountType === "percentage"
                            ? `${subBatch.discount}%`
                            : `₹${subBatch.discount}`}
                        </div>
                        <div>
                          <strong>Manufacture Date:</strong>
                          {formatDate(subBatch.manufactureDate)}
                        </div>
                        <div>
                          <strong>Expiry Date:</strong>
                          {formatDate(subBatch.expiryDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;

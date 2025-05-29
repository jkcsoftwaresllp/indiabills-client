import React from "react";
import { getBaseURL } from "../../../network/api/api-config";

const ShortInvoiceTemplate = ({ invoice, Organization }) => {
  // Calculate totals
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + parseFloat(item.unitPrice) * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // Assuming 18% tax
  const shippingCost = 50; // Assuming flat shipping cost
  const discount = subtotal * 0.1; // Assuming 10% discount
  const totalAmount = subtotal + tax + shippingCost - discount;

  return (
    <div className="w-full flex items-center justify-center mx-auto p-4">
      <div id="invoice" className="bg-white shadow-md rounded-xl p-8 w-fit">
        <div className="grid grid-cols-2 items-center">
          <div className="w-fit">
            <img
              src={`${getBaseURL()}/${Organization.logo}`}
              alt={`${Organization.organizationName} logo`}
              className="w-32 h-32 mb-4"
            />
          </div>
          <div className="flex flex-col items-start">
            <h4 className="text-xl font-medium">Invoice</h4>
            <h2 className="text-2xl font-bold">
              {Organization.organizationName || "Blab"}
            </h2>
            <div className="flex flex-col text-slate-600">
              <p>Order ID: #{invoice.orderId}</p>
              <p>Invoice Number: {invoice.invoiceNumber}</p>
              <p>
                Invoice Date:{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>
              <p>
                Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
              <p>Payment Status: {invoice.paymentStatus}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Item ID</th>
                <th className="py-2 px-4 border-b">Item Name</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Unit Price</th>
                <th className="py-2 px-4 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.itemId}>
                  <td className="py-2 px-4 border-b">{item.itemId}</td>
                  <td className="py-2 px-4 border-b">{item.itemName}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    ₹{parseFloat(item.unitPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    ₹{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-2 border-r-2">
            <div className="flex justify-between">
              <p className="text-slate-500">Subtotal:</p>
              <p className="text-slate-500">₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-500">Tax (18%):</p>
              <p className="text-slate-500">₹{tax.toFixed(2)}</p>
            </div>
          </div>
          <div className="p-2">
            <div className="flex justify-between">
              <p className="text-slate-500">Shipping Cost:</p>
              <p className="text-slate-500">₹{shippingCost.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-slate-500">Discount Applied:</p>
              <p className="text-slate-500">₹{discount.toFixed(2)}</p>
            </div>
          </div>
          <div className="col-span-2">
            <h6 className="text-xl mt-2 font-semibold">
              Total Amount:{" "}
              <span className="text-emerald-900">
                ₹{totalAmount.toFixed(2)}
              </span>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortInvoiceTemplate;

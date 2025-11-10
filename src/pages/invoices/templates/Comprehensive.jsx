import QRCode from 'react-qr-code';
import numberToWords from 'number-to-words';
import { formatDateDDMMYYYY } from "../../../utils/FormHelper";

const ComprehensiveReportTemplate = ({ invoice, organization, initials }) => {
  const upiUrl = `upi://pay?pa=${organization.upi}&pn=${encodeURIComponent(organization.organizationName)}&cu=INR`;

  const formatPercent = (no) => {
    const num = Number(no);
    return Number.isInteger(num) ? Math.trunc(num) : num.toFixed(2);
  };
  
  const formatNumber = (num) => {
    return Number(num).toFixed(2);
  };

  const processedItems = invoice.items.map((item, index) => {
    const unitPrice = parseFloat(item.purchasePrice);
    const salePrice = parseFloat(item.salePrice);
    const quantity = item.quantity;
    const cess = parseFloat(item.cess);
    const cgst = parseFloat(item.cgst);
    const sgst = parseFloat(item.sgst);
    const totalTaxPercentage = cess + cgst + sgst;
    const total = parseFloat((salePrice * quantity).toFixed(3));
    const taxAmount = parseFloat(((total * totalTaxPercentage) / 100).toFixed(3));
    const rate = salePrice ? parseFloat(((total - taxAmount) / quantity).toFixed(3)) : 0;

    return {
      ...item,
      rate,
      total,
      taxAmount,
      totalTaxPercentage,
    };
  });

  const subtotal = parseFloat(
    processedItems
      .reduce((acc, item) => acc + item.rate * item.quantity, 0)
      .toFixed(3)
  );

  const totalItemDiscount = parseFloat(
    processedItems
      .reduce((acc, item) => acc + parseFloat(item.discount) * item.quantity, 0)
      .toFixed(3)
  );

  const orderDiscount = parseFloat((Number(invoice.discountOnOrder) || 0).toFixed(3) || '0.000');

  const discountApplied = parseFloat((totalItemDiscount + orderDiscount).toFixed(3));

  const taxAmount = parseFloat(
    processedItems
      .reduce((acc, item) => acc + item.taxAmount, 0)
      .toFixed(3)
  );

  const totalAmount = parseFloat(
    (subtotal - discountApplied + taxAmount).toFixed(3)
  );

  const roundedOffAmount = Math.round(Number(totalAmount));
  const amountInWords = numberToWords.toWords(roundedOffAmount);

  const totals = {
    rate: parseFloat(
      processedItems
        .reduce((acc, item) => acc + item.rate, 0)
        .toFixed(3)
    ),
    tax: parseFloat(
      processedItems
        .reduce((acc, item) => acc + item.totalTaxPercentage, 0)
        .toFixed(3)
    ),
    netTotal: parseFloat(
      processedItems
        .reduce((acc, item) => acc + item.total, 0)
        .toFixed(3)
    ),
  };

  const shippingCost = parseFloat(invoice.shippingCost);

  return (
    <div id="invoice-container" className="w-full flex flex-col items-center justify-center text-xs">
      <div id="invoice-content" className="bg-white relative flex flex-col shadow-md rounded-xl py-3 px-4 min-w-full max-w-4xl">

        <section id={"upper-row"} className={"flex w-full justify-between"}>

        <div id="contact" className="flex flex-col text-xs">
            <p><b>GSTIN:</b> {organization.gstin}</p>
            <p><b>UPI:</b> {organization.upi}</p>
            <p><b>Phone:</b> {organization.phone}</p>
        </div>

        <div className="flex flex-col border-b-2 pb-2 text-center">
          <h1 className="text-xl font-medium mb-2">Tax Invoice</h1>
          <h2 className="text-2xl font-bold">{organization.organizationName}</h2>
          <span className="flex self-center text-sm">
            <p className="capitalize">{organization.addressLine}</p>
          </span>
        </div>

          {organization.upi && (
              <div id="qr-sec" className="">
                <QRCode value={upiUrl} size={80} />
              </div>
          )}

        </section>

        <div className="flex w-full justify-between gap-4 mt-1">
          <div className="flex flex-col">
            <p><strong>Customer Name:</strong> {invoice.customerName}</p>
            {(invoice.gstin? invoice.gstin !== `0` : false) && <p><strong>GSTIN:</strong> {invoice.gstin}</p>}
            <p className="capitalize"><strong>Address:</strong> {invoice.shippingAddress}</p>
            <p><strong>Mobile:</strong> {invoice.mobile}</p>
          </div>
          <div className="flex flex-col">
            <p><strong>Invoice Number:</strong> {`${initials}-${invoice.invoiceNumber}`}</p>
            <p><strong>Invoice Date:</strong> {formatDateDDMMYYYY(new Date(invoice.invoiceDate))}</p>
            <p className="capitalize"><strong>Payment Method:</strong> {invoice.paymentMethod === 'upi' ? 'UPI' : invoice.paymentMethod} </p>
          </div>
        </div>

        <div className="overflow-x-auto mt-1">
          <table className="w-full table-fixed text-xs bg-white border border-gray-200 rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-2/12 py-1 border-b border-gray-200 text-center">S.No</th>
                <th className="w-5/12 py-1 border-b border-gray-200 text-left">Item</th>
                <th className="w-3/12 py-1 border-b border-gray-200 text-center">HSN</th>
                <th className="w-2/12 py-1 border-b border-gray-200 text-center">MRP</th>
                <th className="w-2/12 py-1 border-b border-gray-200 text-center">QTY</th>
                <th className="w-3/12 py-1 border-b border-gray-200 text-center">Rate</th>
                <th className="w-3/12 py-1 border-b border-gray-200 text-center">GST<span className="font-extralight text-xs uppercase"> (cgst+sgst+cess)</span></th>
                <th className="w-2/12 py-1 border-b border-gray-200 text-center">DIS</th>
                <th className="w-2/12 py-1 border-b border-gray-200 text-center">Net</th>
              </tr>
            </thead>
            <tbody>
              {processedItems.map((item, index) => {
                const tax = `${formatPercent(item.totalTaxPercentage)}% (${formatPercent(item.cgst)}+${formatPercent(item.sgst)}+${formatPercent(item.cess)})`;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200 text-center text-xs">{index + 1}</td>
                    <td className="capitalize py-1 border-b border-gray-200 text-left text-xs">{item.itemName}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{item.hsn || '-'}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{item.unitMRP || '-'}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{item.quantity}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{formatNumber(item.rate)}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{tax}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{Number(item.discount).toFixed(2)}</td>
                    <td className="py-1 border-b border-gray-200 text-center text-xs">{formatNumber(item.total)}</td>
                  </tr>
                );
              })}
              <tr className="font-bold bg-gray-100">
                <td className="py-1 px-2 border-b border-gray-200 text-center" colSpan={5}>Total</td>
                <td className="py-1 px-2 border-b border-gray-200 text-center">₹{formatNumber(totals.rate)}</td>
                <td className="py-1 px-2 border-b border-gray-200 text-center">₹{formatNumber(taxAmount)}</td>
                <td className="py-1 px-2 border-b border-gray-200 text-center"></td>
                <td className="py-1 px-2 border-b border-gray-200 text-center">₹{formatNumber(totals.netTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="p-2 flex justify-between w-full text-xs border-b-2">
          <div className="flex flex-col w-full items-start text-nowrap">
            <p><strong>Account Number:</strong> {organization.accountNumber}</p>
            <p><strong>IFSC Code:</strong> {organization.ifscCode}</p>
            <p className="capitalize"><strong>Bank Branch:</strong> {organization.bankBranch}</p>
            <p className="capitalize"> <strong>Amount in Words:</strong> {amountInWords} </p>
            <p><strong>Declaration:</strong> {invoice.declaration || "Thank you for your purchase!"} </p>
          </div>
        <div className="flex flex-col w-1/3">
            <div className="flex justify-between w-full">
              <p className="text-slate-500">Subtotal:</p>
              <p className="text-slate-500">₹{formatNumber(subtotal)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-slate-500">Discount Applied:</p>
              <p className="text-slate-500">₹{formatNumber(discountApplied)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-slate-500">Total Tax:</p>
              <p className="text-slate-500">₹{formatNumber(taxAmount)}</p>
            </div>
            {shippingCost > 0 && <div className="flex justify-between w-full">
              <p className="text-slate-500">Shipping Cost:</p>
              <p className="text-slate-500">₹{formatNumber(shippingCost)}</p>
            </div>}
            <div className="flex justify-between font-bold w-full">
              <p>Total Amount:</p>
              <p>₹{formatNumber(totalAmount)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p className="text-slate-500">Rounded Off (Gross):</p>
              <p className="text-slate-500">₹{formatNumber(roundedOffAmount)}</p>
            </div>
        </div>
        </section>

        <div className="mt-6 p-2 flex justify-between items-end">
          <div> <p className="text-slate-500">This is a computer-generated invoice.</p> </div>
          <div className="text-center">
            {invoice.authorizedSignature && (
              <img
                src={invoice.authorizedSignature}
                alt="Authorized Signature"
                className="w-32 h-32 mb-2"
              />
            )}
            <p className="font-medium">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveReportTemplate;
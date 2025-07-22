import React from 'react';
import ViewInvoices from '../invoices/InspectInvoice';

const CustomerInvoices = () => {
  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">My Invoices</h1>
        <p className="text-gray-600">
          View and download all your invoices and billing information.
        </p>
      </div>
      <ViewInvoices />
    </div>
  );
};

export default CustomerInvoices;
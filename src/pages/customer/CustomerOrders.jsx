import React from 'react';
import ViewOrders from '../orders/ViewOrders';

const CustomerOrders = () => {
  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-600">
          Track and manage all your orders in one place.
        </p>
      </div>
      <ViewOrders />
    </div>
  );
};

export default CustomerOrders;
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Shop from '../shop/Shop';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Explore our products and manage your orders from your personal dashboard.
        </p>
      </div>
      <Shop />
    </div>
  );
};

export default CustomerDashboard;
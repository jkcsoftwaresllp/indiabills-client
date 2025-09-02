import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Shop from '../shop/Shop';
import { 
  ShoppingCart as CartIcon,
  Receipt as InvoiceIcon,
  LocalShipping as OrderIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'My Orders',
      description: 'Track your recent orders',
      icon: <OrderIcon sx={{ fontSize: 32 }} />,
      path: '/customer/orders',
      color: 'bg-blue-500'
    },
    {
      title: 'My Invoices',
      description: 'View billing information',
      icon: <InvoiceIcon sx={{ fontSize: 32 }} />,
      path: '/customer/invoices',
      color: 'bg-green-500'
    },
    {
      title: 'Shopping Cart',
      description: 'Complete your purchase',
      icon: <CartIcon sx={{ fontSize: 32 }} />,
      path: '/customer/cart',
      color: 'bg-orange-500'
    },
    {
      title: 'My Profile',
      description: 'Manage account settings',
      icon: <ProfileIcon sx={{ fontSize: 32 }} />,
      path: '/customer/profile',
      color: 'bg-purple-500'
    }
  ];

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
      
      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
            >
              <div className="p-4 text-center">
                <div className={`${action.color} text-white rounded-full w-12 h-12 flex items-center justify-center mb-3 mx-auto`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Shop />
    </div>
  );
};

export default CustomerDashboard;
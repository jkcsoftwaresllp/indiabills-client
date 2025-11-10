import { FiBox, FiPlus, FiList, FiTool, FiTag, FiUsers, FiTruck } from 'react-icons/fi';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const OperatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const operatorRoutes = [
    {
      title: 'Inventory Management',
      description: 'Manage stock levels, batches, and warehouse operations',
      icon: <FiBox sx={{ fontSize: 48 }} />,
      path: '/operator/inventory',
      color: 'bg-blue-500'
    },
    {
      title: 'Stock Movements',
      description: 'Track all inventory movements and transactions',
      icon: <FiBox sx={{ fontSize: 48 }} />,
      path: '/operator/inventory/movements',
      color: 'bg-cyan-500'
    },
    {
      title: 'Stock Levels',
      description: 'Monitor current stock levels across warehouses',
      icon: <FiBox sx={{ fontSize: 48 }} />,
      path: '/operator/inventory/stock',
      color: 'bg-teal-500'
    },
    {
      title: 'Reconciliations',
      description: 'Perform and manage inventory reconciliations',
      icon: <FiBox sx={{ fontSize: 48 }} />,
      path: '/operator/inventory/reconciliations',
      color: 'bg-emerald-500'
    },
    {
      title: 'Warehouses',
      description: 'Manage warehouse locations and capacity',
      icon: <FiBox sx={{ fontSize: 48 }} />,
      path: '/operator/warehouses',
      color: 'bg-gray-500'
    },
    {
    title: 'Items Catalog',
    description: 'Add, edit, and manage product items',
    icon: <FiList sx={{ fontSize: 48 }} />,
    path: '/operator/products',
    color: 'bg-green-500'
    },
    {
    title: 'Suppliers',
    description: 'Manage supplier information and relationships',
    icon: <FiTool sx={{ fontSize: 48 }} />,
    path: '/operator/suppliers',
    color: 'bg-purple-500'
    },
    {
    title: 'Offers & Promotions',
    description: 'Create and manage promotional offers',
    icon: <FiTag sx={{ fontSize: 48 }} />,
    path: '/operator/offers',
    color: 'bg-orange-500'
    },
    {
    title: 'Customer Management',
    description: 'View and manage customer information',
    icon: <FiUsers sx={{ fontSize: 48 }} />,
      path: '/operator/customers',
      color: 'bg-indigo-500'
    },
    {
    title: 'Transport & Logistics',
    description: 'Manage transportation and delivery services',
    icon: <FiTruck sx={{ fontSize: 48 }} />,
    path: '/operator/transport',
    color: 'bg-red-500'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 text-lg">
          Operator Dashboard - Manage operations efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operatorRoutes.map((route, index) => (
          <div
            key={index}
            onClick={() => handleNavigate(route.path)}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
          >
            <div className="p-6">
              <div className={`${route.color} text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                {route.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                {route.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {route.description}
              </p>
            </div>
            <div className="px-6 pb-6">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                Access Module
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-800 mb-2">Quick Tips</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Use the inventory module to track stock levels and manage batches</li>
          <li>• FiPlus new products through the items catalog</li>
          <li>• Keep supplier information updated for smooth operations</li>
          <li>• Create promotional offers to boost sales</li>
        </ul>
      </div>
    </div>
  );
};

export default OperatorDashboard;
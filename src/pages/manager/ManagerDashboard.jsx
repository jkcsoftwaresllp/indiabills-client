import { FiBox, FiPlus, FiUsers, FiList, FiTool, FiTag, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const managerRoutes = [
    {
      title: 'Customer Management',
      description: 'Manage customers within your organization',
      icon: <FiUsers size={48} style={{ color: '#3b82f6' }} />,
      path: '/manager/customers',
      color: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      title: 'Inventory Management',
      description: 'Manage stock levels, batches, and warehouse operations',
      icon: <FiBox size={48} style={{ color: '#10b981' }} />,
      path: '/manager/inventory',
      color: 'bg-green-50 hover:bg-green-100',
    },
    {
      title: 'Product Catalog',
      description: 'Manage your product offerings and pricing',
      icon: <FiList size={48} style={{ color: '#f59e0b' }} />,
      path: '/manager/products',
      color: 'bg-yellow-50 hover:bg-yellow-100',
    },
    {
      title: 'Supplier Network',
      description: 'Manage suppliers and procurement',
      icon: <FiTool size={48} style={{ color: '#ef4444' }} />,
      path: '/manager/suppliers',
      color: 'bg-red-50 hover:bg-red-100',
    },
    {
      title: 'Offers & Promotions',
      description: 'Create and manage promotional offers',
      icon: <FiTag size={48} style={{ color: '#8b5cf6' }} />,
      path: '/manager/offers',
      color: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      title: 'Transport Management',
      description: 'Manage transportation and logistics',
      icon: <FiTruck size={48} style={{ color: '#06b6d4' }} />,
      path: '/manager/transport',
      color: 'bg-cyan-50 hover:bg-cyan-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manager Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'Manager'}! Here's an overview of your management tools.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managerRoutes.map((route, index) => (
            <div
              key={index}
              onClick={() => navigate(route.path)}
              className={`cursor-pointer rounded-lg p-6 shadow-sm border border-gray-200 transition-all duration-200 ${route.color} transform hover:scale-105`}
            >
              <div className="flex items-center mb-4">
                {route.icon}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {route.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {route.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Stats or Additional Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/manager/customers/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Customer
            </button>
            <button
              onClick={() => navigate('/manager/inventory')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              View Inventory
            </button>
            <button
              onClick={() => navigate('/manager/products/add')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate('/manager/reports')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

import { FiChevronDown, FiChevronUp, FiFilter, FiSearch } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { IconButton, InputBase, MenuItem, Select } from '@mui/material';
import React from 'react';
import { EachOrder } from './EachOrder';
import PageAnimate from '../../components/Animate/PageAnimate';
import axios from 'axios';

const safeParse = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error('Failed to parse variants JSON:', e);
    return null;
  }
};

// Get orders from localStorage or API
const getOrdersData = () => {
  const storedOrders = localStorage.getItem('customerOrders');
  if (storedOrders) {
    return JSON.parse(storedOrders);
  }
  return [];
};

// Fetch payment status for orders
const fetchPaymentStatuses = async (orders) => {
  const updatedOrders = await Promise.all(
    orders.map(async (order) => {
      try {
        // Assuming we can get payment by order_id, but since API is by payment_id or invoice_id, perhaps query by order_id
        // For now, assume payment status is updated in localStorage when changed
        // But to make it work, we can call an API to get payment for order
        // Since no such API, for now keep as is
        return order;
      } catch (error) {
        console.error('Error fetching payment status for order:', order.orderId, error);
        return order;
      }
    })
  );
  return updatedOrders;
};

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [timelineCollapsed, setTimelineCollapsed] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [initials, setInitials] = useState("");
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    // Load orders from localStorage or API
    const timeout = setTimeout(() => {
      const ordersData = getOrdersData();
      const parsed = ordersData.map(order => ({
        ...order,
        items: order.items.map(item => ({
          ...item,
          variants: safeParse(item.variants)
        }))
      }));
      setOrders(parsed);

      const initialTimelineCollapsed = parsed.reduce((acc, order) => {
        acc[order.orderId] = true;
        return acc;
      }, {});
      setTimelineCollapsed(initialTimelineCollapsed);

      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  const handleMarkPayment = async (orderId, status) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? { ...order, paymentStatus: order.paymentStatus === 'paid' ? 'pending' : 'paid' }
          : order
      )
    );
    successPopup('Payment status updated (mock)');
  };

  const handleChangeOrderStatus = async (orderId, status) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId ? { ...order, orderStatus: status } : order
      )
    );
    successPopup('Order status updated (mock)');
  };

  const toggleTimeline = (orderId) => {
    setTimelineCollapsed((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortFieldChange = (e) => setSortField(e.target.value);
  const handleSortOrderToggle = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(term) ||
      order.orderId.toString().includes(term) ||
      order.invoiceNumber.toString().includes(term)
    );
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'totalAmount') {
      comparison = parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
    } else if (sortField === 'orderDate') {
      comparison = new Date(a.orderDate) - new Date(b.orderDate);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  const legendTextClasses = 'text-sm text-gray-700';

  return (
    <PageAnimate>
      <div className="container mx-auto p-4 w-full">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <IconButton aria-label="search">
              <FiSearch />
            </IconButton>
            <InputBase
              placeholder="Search by Customer Name, Invoice Number or Order ID"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
              className="ml-2"
            />
          </div>
          <div className="flex items-center">
            <FiFilter />
            <Select
              value={sortField}
              onChange={handleSortFieldChange}
              displayEmpty
              className="ml-2"
              inputProps={{ 'aria-label': 'sort' }}
            >
              <MenuItem value="orderDate">Date Added</MenuItem>
              <MenuItem value="totalAmount">Total Price</MenuItem>
            </Select>
            <IconButton onClick={handleSortOrderToggle} aria-label="toggle sort order">
              {sortOrder === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
            </IconButton>
          </div>
        </div>

        {/* Legend */}
        <button onClick={toggleCollapse} className="text-link underline mb-4">
          {isCollapsed ? 'Show Legend' : 'Hide'}
        </button>
        {!isCollapsed && (
          <div className="grid grid-cols-2 md:flex md:justify-around w-full mb-4 bg-[#e6ebf1] p-2 shadow-inner rounded-xl">
            <div className="flex items-center gap-2"><div className="bg-[#dea01e] w-4 h-4 rounded-full"></div><p className={legendTextClasses}>Pending</p></div>
            <div className="flex items-center gap-2"><div className="bg-[#0db0b4] w-4 h-4 rounded-full"></div><p className={legendTextClasses}>Shipped</p></div>
            <div className="flex items-center gap-2"><div className="bg-red-500 w-4 h-4 rounded-full"></div><p className={legendTextClasses}>Returned</p></div>
            <div className="flex items-center gap-2"><div className="bg-[#23ae8d] w-4 h-4 rounded-full"></div><p className={legendTextClasses}>Fulfilled</p></div>
            <div className="flex items-center gap-2"><div className="bg-gray-500 w-4 h-4 rounded-full"></div><p className={legendTextClasses}>Cancelled</p></div>
          </div>
        )}

        {/* Order Cards */}
        {sortedOrders.length === 0 ? (
          <div className="container mx-auto p-4">
            <h6 className="text-lg">No orders matched your search</h6>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedOrders.map((order) => (
              <div key={order.orderId} className="border bg-card-bg flex flex-col h-64 rounded-lg p-4 shadow-lg relative">
                <EachOrder
                  initials={initials}
                  order={order}
                  handleMarkPayment={handleMarkPayment}
                  handleChangeOrderStatus={handleChangeOrderStatus}
                  toggleTimeline={toggleTimeline}
                  timelineCollapsed={timelineCollapsed}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageAnimate>
  );
};

export default ViewOrders;

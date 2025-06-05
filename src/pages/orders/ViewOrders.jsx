import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useEffect, useState } from 'react';
import { getData, getRequest, postData } from '../../network/api';
import { socket } from '../../network/websocket';
import { useStore } from '../../store/store';
import { IconButton, InputBase, MenuItem, Select } from '@mui/material';
import React from 'react';
import { EachOrder } from './EachOrder';
import PageAnimate from '../../components/Animate/PageAnimate';
import styles from './styles/ViewOrders.module.css';

const safeParse = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error('Failed to parse variants JSON:', e);
    return null;
  }
};

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [timelineCollapsed, setTimelineCollapsed] = useState({});

  // State variables for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('orderDate'); // default sorting field
  const [sortOrder, setSortOrder] = useState('desc'); // default sorting order

  const [initials, setInitials] = useState("");

  useEffect(() => {
    const fetchFormDetails = async () => {
      const ini = await getData("/settings/initials");
      setInitials(ini);
    };
    fetchFormDetails().then();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRequest('/orders');

        // Parse the variants field
        const parsedData = data.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            variants: safeParse(item.variants),
          })),
        }));

        setOrders(parsedData);

        // Initialize timelineCollapsed with all orders set to true
        const initialTimelineCollapsed = data.reduce((acc, order) => {
          acc[order.orderId] = true;
          return acc;
        }, {});
        setTimelineCollapsed(initialTimelineCollapsed);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const handleOrderStatusUpdated = (data) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === Number(data.orderId) ? { ...order, orderStatus: data.status } : order
        )
      );
    };

    socket.on('order_status_updated', handleOrderStatusUpdated);

    return () => {
      socket.off('order_status_updated', handleOrderStatusUpdated);
    };
  }, []);

  const handleMarkPayment = async (orderId, status) => {
    try {
      await postData(`/orders/payment/${orderId}/`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.orderId === orderId ? { ...order, paymentStatus: (order.paymentStatus === 'paid' ? 'pending' : 'paid') } : order))
      );
    } catch (error) {
      console.error('Error marking payment:', error);
      errorPopup('Failed marking payment');
    }
  };

  const handleChangeOrderStatus = async (orderId, status) => {
    if (!status) return;

    try {
      const result = await postData(`/orders/status/${orderId}`, { status });

      if (result !== 200) {
        console.error(`Error changing order status to ${status}:`);
        errorPopup('Failed updating order status');
        return;
      }

      successPopup('Order status updated!');
    } catch (error) {
      console.error(`Error changing order status to ${status}:`, error);
    }
  };

  const toggleTimeline = (orderId) => {
    setTimelineCollapsed((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle sort field change
  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  // Handle sort order toggle
  const handleSortOrderToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(term) ||
      order.orderId.toString().includes(term) ||
      order.invoiceNumber.toString().includes(term)
    );
  });

  // Sort the filtered orders
  const sortedOrders = filteredOrders.sort((a, b) => {
    let comparison = 0;

    if (sortField === 'totalAmount') {
      const priceA = parseFloat(a.totalAmount);
      const priceB = parseFloat(b.totalAmount);
      comparison = priceA - priceB;
    } else if (sortField === 'orderDate') {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      comparison = dateA - dateB;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
  return (
    <div className={styles.container}>
      <div className={styles.loaderWrapper}>
        <div className="loader"></div> {/* Assuming .loader CSS stays in global */}
      </div>
    </div>
  );
}

if (orders.length === 0) {
  return (
    <div className={styles.container}>
      <h6 className={styles.headingText}>No orders found</h6>
    </div>
  );
}

const legendTextClasses = styles.legendText;

return (
  <PageAnimate>
    <div className={`${styles.container} w-full`}>
      {/* Search and Sorting Controls */}
      <div className={styles.controlsContainer}>
        <div className={styles.searchWrapper}>
          <IconButton type="button" aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search by Customer Name, Invoice Number or Order ID"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.inputMarginLeft}
          />
        </div>
        <div className={styles.sortWrapper}>
          <SortIcon />
          <Select
            value={sortField}
            onChange={handleSortFieldChange}
            displayEmpty
            className={styles.marginLeftSmall}
            inputProps={{ 'aria-label': 'sort' }}
          >
            <MenuItem value="orderDate">Date Added</MenuItem>
            <MenuItem value="totalAmount">Total Price</MenuItem>
          </Select>
          <IconButton
            onClick={handleSortOrderToggle}
            aria-label="toggle sort order"
            className={styles.marginLeftSmall}
          >
            {sortOrder === 'asc' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </div>

      <button onClick={toggleCollapse} className={styles.toggleLegendButton}>
        {isCollapsed ? 'Show Legend' : 'Hide'}
      </button>

      {!isCollapsed && (
        <div id="color-meaning" className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotPending}`}></div>
            <p className={legendTextClasses}>Pending</p>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotShipped}`}></div>
            <p className={legendTextClasses}>Shipped</p>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotReturned}`}></div>
            <p className={legendTextClasses}>Returned</p>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotFulfilled}`}></div>
            <p className={legendTextClasses}>Fulfilled</p>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotCancelled}`}></div>
            <p className={legendTextClasses}>Cancelled</p>
          </div>
        </div>
      )}

      {sortedOrders.length === 0 ? (
        <div className={styles.container}>
          <h6 className={styles.headingText}>No orders matched your search</h6>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {sortedOrders.map((order) => (
            <div key={order.orderId} className={styles.orderCard}>
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

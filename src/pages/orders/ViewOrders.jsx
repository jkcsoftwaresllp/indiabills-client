// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import SearchIcon from '@mui/icons-material/Search';
// import SortIcon from '@mui/icons-material/Sort';
// import { useEffect, useState } from 'react';
// import { getData, getRequest, postData } from '../../network/api';
// import { socket } from '../../network/websocket';
// import { useStore } from '../../store/store';
// import { IconButton, InputBase, MenuItem, Select } from '@mui/material';
// import React from 'react';
// import { EachOrder } from './EachOrder';
// import PageAnimate from '../../components/Animate/PageAnimate';

// const safeParse = (jsonString) => {
//   try {
//     return jsonString ? JSON.parse(jsonString) : null;
//   } catch (e) {
//     console.error('Failed to parse variants JSON:', e);
//     return null;
//   }
// };

// const ViewOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [timelineCollapsed, setTimelineCollapsed] = useState({});

//   // State variables for search and sorting
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState('orderDate'); // default sorting field
//   const [sortOrder, setSortOrder] = useState('desc'); // default sorting order

//   const [initials, setInitials] = useState("");

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       const ini = await getData("/settings/initials");
//       setInitials(ini);
//     };
//     fetchFormDetails().then();
//   }, []);

//   const toggleCollapse = () => {
//     setIsCollapsed((prev) => !prev);
//   };

//   const { successPopup, errorPopup } = useStore();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await getRequest('/orders');

//         // Parse the variants field
//         const parsedData = data.map((order) => ({
//           ...order,
//           items: order.items.map((item) => ({
//             ...item,
//             variants: safeParse(item.variants),
//           })),
//         }));

//         setOrders(parsedData);

//         // Initialize timelineCollapsed with all orders set to true
//         const initialTimelineCollapsed = data.reduce((acc, order) => {
//           acc[order.orderId] = true;
//           return acc;
//         }, {});
//         setTimelineCollapsed(initialTimelineCollapsed);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     const handleOrderStatusUpdated = (data) => {
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.orderId === Number(data.orderId) ? { ...order, orderStatus: data.status } : order
//         )
//       );
//     };

//     socket.on('order_status_updated', handleOrderStatusUpdated);

//     return () => {
//       socket.off('order_status_updated', handleOrderStatusUpdated);
//     };
//   }, []);

//   const handleMarkPayment = async (orderId, status) => {
//     try {
//       await postData(`/orders/payment/${orderId}/`, { status });
//       setOrders((prevOrders) =>
//         prevOrders.map((order) => (order.orderId === orderId ? { ...order, paymentStatus: (order.paymentStatus === 'paid' ? 'pending' : 'paid') } : order))
//       );
//     } catch (error) {
//       console.error('Error marking payment:', error);
//       errorPopup('Failed marking payment');
//     }
//   };

//   const handleChangeOrderStatus = async (orderId, status) => {
//     if (!status) return;

//     try {
//       const result = await postData(`/orders/status/${orderId}`, { status });

//       if (result !== 200) {
//         console.error(`Error changing order status to ${status}:`);
//         errorPopup('Failed updating order status');
//         return;
//       }

//       successPopup('Order status updated!');
//     } catch (error) {
//       console.error(`Error changing order status to ${status}:`, error);
//     }
//   };

//   const toggleTimeline = (orderId) => {
//     setTimelineCollapsed((prev) => ({
//       ...prev,
//       [orderId]: !prev[orderId],
//     }));
//   };

//   // Handle search input change
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Handle sort field change
//   const handleSortFieldChange = (event) => {
//     setSortField(event.target.value);
//   };

//   // Handle sort order toggle
//   const handleSortOrderToggle = () => {
//     setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
//   };

//   // Filter orders based on search term
//   const filteredOrders = orders.filter((order) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       order.customerName.toLowerCase().includes(term) ||
//       order.orderId.toString().includes(term) ||
//       order.invoiceNumber.toString().includes(term)
//     );
//   });

//   // Sort the filtered orders
//   const sortedOrders = filteredOrders.sort((a, b) => {
//     let comparison = 0;

//     if (sortField === 'totalAmount') {
//       const priceA = parseFloat(a.totalAmount);
//       const priceB = parseFloat(b.totalAmount);
//       comparison = priceA - priceB;
//     } else if (sortField === 'orderDate') {
//       const dateA = new Date(a.orderDate).getTime();
//       const dateB = new Date(b.orderDate).getTime();
//       comparison = dateA - dateB;
//     }

//     return sortOrder === 'asc' ? comparison : -comparison;
//   });

//   if (loading) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="flex justify-center">
//           <div className="loader"></div>
//         </div>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="container mx-auto p-4">
//         <h6 className="text-lg">No orders found</h6>
//       </div>
//     );
//   }

//   const legendTextClasses = 'text-sm text-gray-700';

//   return (
//     <PageAnimate>
//       <div className="container mx-auto p-4 w-full">
//         {/* Search and Sorting Controls */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//           <div className="flex items-center mb-4 md:mb-0">
//             <IconButton type="button" aria-label="search">
//               <SearchIcon />
//             </IconButton>
//             <InputBase
//               placeholder="Search by Customer Name, Invoice Number or Order ID"
//               inputProps={{ 'aria-label': 'search' }}
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="ml-2"
//             />
//           </div>
//           <div className="flex items-center">
//             <SortIcon />
//             <Select
//               value={sortField}
//               onChange={handleSortFieldChange}
//               displayEmpty
//               className="ml-2"
//               inputProps={{ 'aria-label': 'sort' }}
//             >
//               <MenuItem value="orderDate">Date Added</MenuItem>
//               <MenuItem value="totalAmount">Total Price</MenuItem>
//             </Select>
//             <IconButton onClick={handleSortOrderToggle} aria-label="toggle sort order">
//               {sortOrder === 'asc' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//             </IconButton>
//           </div>
//         </div>

//         <button onClick={toggleCollapse} className="text-link underline mb-4">
//           {isCollapsed ? 'Show Legend' : 'Hide'}
//         </button>
//         {!isCollapsed && (
//           <div id="color-meaning" className="p-2 xs:grid xs:grid-cols-2 md:flex md:justify-around w-full mb-4 bg-[#e6ebf1] shadow-inner rounded-xl">
//             <div className="flex items-center gap-4">
//               <div className="bg-[#dea01e] w-4 h-4 rounded-full"></div>
//               <p className={legendTextClasses}>Pending</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="bg-[#0db0b4] w-4 h-4 rounded-full"></div>
//               <p className={legendTextClasses}>Shipped</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="bg-red-500 w-4 h-4 rounded-full"></div>
//               <p className={legendTextClasses}>Returned</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="bg-[#23ae8d] w-4 h-4 rounded-full"></div>
//               <p className={legendTextClasses}>Fulfilled</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="bg-gray-500 w-4 h-4 rounded-full"></div>
//               <p className={legendTextClasses}>Cancelled</p>
//             </div>
//           </div>
//         )}
//         {sortedOrders.length === 0 ? (
//           <div className="container mx-auto p-4">
//             <h6 className="text-lg">No orders matched your search</h6>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {sortedOrders.map((order) => (
//               <div key={order.orderId} className="border bg-card-bg flex flex-col h-64 rounded-lg p-4 shadow-lg relative">
//                 <EachOrder initials={initials} order={order} handleMarkPayment={handleMarkPayment} handleChangeOrderStatus={handleChangeOrderStatus} toggleTimeline={toggleTimeline} timelineCollapsed={timelineCollapsed} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </PageAnimate>
//   );
// };

// export default ViewOrders;


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { IconButton, InputBase, MenuItem, Select } from '@mui/material';
import React from 'react';
import { EachOrder } from './EachOrder';
import PageAnimate from '../../components/Animate/PageAnimate';

const safeParse = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error('Failed to parse variants JSON:', e);
    return null;
  }
};

// 🧪 MOCK DATA
const mockOrders = [
  {
    orderId: 101,
    invoiceNumber: 'INV-2023-0001',
    customerName: 'John Doe',
    orderDate: '2025-07-15T10:30:00Z',
    totalAmount: '2500',
    orderStatus: 'pending',
    paymentStatus: 'pending',
    items: [
      {
        name: 'Wireless Mouse',
        quantity: 2,
        price: 500,
        variants: JSON.stringify({ color: 'Black' })
      },
      {
        name: 'Keyboard',
        quantity: 1,
        price: 1500,
        variants: JSON.stringify({ layout: 'QWERTY' })
      }
    ]
  },
  {
    orderId: 102,
    invoiceNumber: 'INV-2023-0002',
    customerName: 'Jane Smith',
    orderDate: '2025-07-16T15:45:00Z',
    totalAmount: '1200',
    orderStatus: 'fulfilled',
    paymentStatus: 'paid',
    items: [
      {
        name: 'USB-C Cable',
        quantity: 3,
        price: 400,
        variants: JSON.stringify({ length: '1m' })
      }
    ]
  }
];

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
    // Simulate loading mock data
    const timeout = setTimeout(() => {
      const parsed = mockOrders.map(order => ({
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
    }, 800); // simulate 800ms loading delay

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
              <SearchIcon />
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
            <SortIcon />
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
              {sortOrder === 'asc' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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

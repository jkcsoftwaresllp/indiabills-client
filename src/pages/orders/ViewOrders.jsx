import {
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiSearch,
  FiSettings,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { IconButton, InputBase, MenuItem, Select } from "@mui/material";
import { EachOrder } from "./EachOrder";
import PageAnimate from "../../components/Animate/PageAnimate";
import { getCustomerOrders } from "../../network/api";

const safeParse = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error("Failed to parse variants JSON:", e);
    return null;
  }
};

// Transform API response to match frontend format
const transformOrderData = (apiOrders) => {
  return apiOrders.map((order) => ({
    // Core order fields
    orderId: order.id,
    orderNumber: order.order_number,
    orderDate: order.order_date,
    orderStatus: order.order_status,

    // Customer details
    customerId: order.customer_id,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,

    // Payment details
    paymentStatus: order.payment_status,
    paymentStatusDisplay:
      order.payment_status === "unpaid" || order.payment_status === "pending"
        ? "Awaiting Confirmation"
        : order.payment_status || "unpaid",

    // Monetary fields
    totalAmount: order.total_amount,
    discountOnOrder: order.discount_on_order,
    shippingCost: order.shipping_cost,

    // Address details
    billingAddressId: order.billing_address_id,
    shippingAddressId: order.shipping_address_id,
    billingAddress: order.billing_address,
    shippingAddress: order.shipping_address,

    // Shipping details
    shippingDate: order.shipping_date,

    // Additional details
    invoiceNumber: order.order_number, // Using order_number as invoice number
    invoiceDate: order.order_date,
    notes: order.notes || "",

    // Organization & audit info
    organizationId: order.organization_id,
    isActive: order.is_active,
    createdBy: order.created_by,
    createdAt: order.created_at,
    updatedBy: order.updated_by,
    updatedAt: order.updated_at,

    // Items array
    items: Array.isArray(order.items) ? order.items : [],
  }));
};

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [timelineCollapsed, setTimelineCollapsed] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [initials, setInitials] = useState("");
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    // Fetch orders from API
    const timeout = setTimeout(async () => {
      try {
        const response = await getCustomerOrders({
          limit: 100,
          offset: 0,
        });

        if (response.status === 200 && response.data) {
          console.log("API Response:", response.data);
          // Handle both possible response structures
          let apiOrders = [];
          if (Array.isArray(response.data)) {
            apiOrders = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            apiOrders = response.data.data;
          } else if (
            response.data.data &&
            Array.isArray(response.data.data.data)
          ) {
            apiOrders = response.data.data.data;
          }

          if (!Array.isArray(apiOrders)) {
            console.warn("Unexpected API response structure:", response.data);
            apiOrders = [];
          }

          const transformedOrders = transformOrderData(apiOrders);

          // Parse variants if they exist
          const parsed = transformedOrders.map((order) => ({
            ...order,
            items: (order.items || []).map((item) => ({
              ...item,
              variants: safeParse(item.variants),
            })),
          }));

          setOrders(parsed);

          const initialTimelineCollapsed = parsed.reduce((acc, order) => {
            acc[order.orderId] = true;
            return acc;
          }, {});
          setTimelineCollapsed(initialTimelineCollapsed);
        } else {
          console.error("Failed to fetch orders:", response.error);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const handleMarkPayment = async (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              paymentStatus:
                order.paymentStatus === "paid" ? "pending" : "paid",
            }
          : order
      )
    );
    successPopup("Payment status updated (mock)");
  };

  const handleChangeOrderStatus = async (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, orderStatus: status } : order
      )
    );
    successPopup("Order status updated (mock)");
  };

  const toggleTimeline = (orderId) => {
    setTimelineCollapsed((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortFieldChange = (e) => setSortField(e.target.value);
  const handleSortOrderToggle = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      (order.customerName?.toLowerCase() || "").includes(term) ||
      (order.orderId?.toString() || "").includes(term) ||
      (order.invoiceNumber?.toString() || "").includes(term)
    );
  });

  const sortedOrders = filteredOrders.sort((a, b) => {
    let comparison = 0;
    if (sortField === "totalAmount") {
      comparison = parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
    } else if (sortField === "orderDate") {
      comparison = new Date(a.orderDate) - new Date(b.orderDate);
    }
    return sortOrder === "asc" ? comparison : -comparison;
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

  const legendTextClasses = "text-sm text-gray-700";

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
              inputProps={{ "aria-label": "search" }}
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
              inputProps={{ "aria-label": "sort" }}
            >
              <MenuItem value="orderDate">Date Added</MenuItem>
              <MenuItem value="totalAmount">Total Price</MenuItem>
            </Select>
            <IconButton
              onClick={handleSortOrderToggle}
              aria-label="toggle sort order"
            >
              {sortOrder === "asc" ? <FiChevronUp /> : <FiChevronDown />}
            </IconButton>
          </div>
        </div>

        {/* Legend */}
        <button onClick={toggleCollapse} className="text-link underline mb-4">
          {isCollapsed ? "Show Legend" : "Hide"}
        </button>
        {!isCollapsed && (
          <div className="grid grid-cols-2 md:flex md:justify-around w-full mb-4 bg-[#e6ebf1] p-2 shadow-inner rounded-xl">
            <div className="flex items-center gap-2">
              <div className="bg-[#dea01e] w-4 h-4 rounded-full"></div>
              <p className={legendTextClasses}>Pending</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#0db0b4] w-4 h-4 rounded-full"></div>
              <p className={legendTextClasses}>Shipped</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-500 w-4 h-4 rounded-full"></div>
              <p className={legendTextClasses}>Returned</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#23ae8d] w-4 h-4 rounded-full"></div>
              <p className={legendTextClasses}>Fulfilled</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-500 w-4 h-4 rounded-full"></div>
              <p className={legendTextClasses}>Cancelled</p>
            </div>
          </div>
        )}

        {/* Order Cards */}
        {sortedOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-slate-600 font-medium">
                No orders found
              </p>
              <p className="text-sm text-slate-500 mt-1">
                No orders matched your search criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedOrders.map((order) => (
              <div key={order.orderId} className="h-96">
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

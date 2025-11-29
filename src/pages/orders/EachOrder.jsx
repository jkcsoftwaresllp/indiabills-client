import { FiCheck, FiClock, FiEdit, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ContextMenu from "../../components/core/ContextMenu";
import OrderTimelineModal from "./OrderTimelineModal";
import { motion, AnimatePresence } from "framer-motion";
import ItemSection from "./ItemSection";

export const EachOrder = ({
  order,
  timelineCollapsed,
  toggleTimeline,
  handleMarkPayment,
  initials,
  handleChangeOrderStatus,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isItemsVisible, setIsItemsVisible] = useState(false);

  const toggleItemsVisibility = () => {
    setIsItemsVisible((prev) => !prev);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();

    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    const getAvailableStatusSubItems = (currentStatus) => {
      switch (currentStatus) {
        case "shipped":
          return [
            {
              label: "Cancel",
              onClick: () =>
                handleChangeOrderStatus(order.orderId, "cancelled"),
            },
            {
              label: "Fulfilled",
              onClick: () =>
                handleChangeOrderStatus(order.orderId, "fulfilled"),
            },
          ];
        case "returned":
          return [
            {
              label: "Shipped",
              onClick: () => handleChangeOrderStatus(order.orderId, "shipped"),
            },
          ];
        case "fulfilled":
          return [
            {
              label: "Returned",
              onClick: () => handleChangeOrderStatus(order.orderId, "returned"),
            },
          ];
        case "cancelled":
          return [
            {
              label: "Shipped",
              onClick: () => handleChangeOrderStatus(order.orderId, "shipped"),
            },
          ];
        case "pending":
          return [
            {
              label: "Ship",
              onClick: () => handleChangeOrderStatus(order.orderId, "shipped"),
            },
            {
              label: "Cancel",
              onClick: () =>
                handleChangeOrderStatus(order.orderId, "cancelled"),
            },
            {
              label: "Fulfill",
              onClick: () =>
                handleChangeOrderStatus(order.orderId, "fulfilled"),
            },
            {
              label: "Return",
              onClick: () => handleChangeOrderStatus(order.orderId, "returned"),
            },
          ];
        default:
          return [];
      }
    };

    const items = [
      {
        label: "View Invoice",
        onClick: () => navigate(`/invoice/${order.orderId}`),
      },
      { label: "View Timeline", onClick: () => setIsTimelineModalOpen(true) },
      { label: "Edit", onClick: () => navigate(`/orders/${order.orderId}`) },
      {
        label:
          order.paymentStatus === "unpaid" || order.paymentStatus === "pending"
            ? "Mark as Paid"
            : "Mark as Unpaid",
        onClick: () =>
          handleMarkPayment(
            order.orderId,
            order.paymentStatus !== "paid" ? "paid" : "unpaid"
          ),
      },
      {
        label: "Change Status",
        subItems: getAvailableStatusSubItems(order.orderStatus),
      },
    ];

    setContextMenu({ x, y, items });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".context-menu")) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#dea01e]";
      case "shipped":
        return "bg-[#0db0b4]";
      case "returned":
        return "bg-red-500";
      case "fulfilled":
        return "bg-[#23ae8d]";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-white";
    }
  };

  const mainViewVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const itemsViewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <main
      ref={containerRef}
      className="relative z-30 h-full flex flex-col"
      onContextMenu={handleContextMenu}
    >
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full overflow-hidden">
        {/* Status Indicator Dot */}
        <div className="absolute top-4 right-4 z-40">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(
                order.orderStatus
              )} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(
                order.orderStatus
              )}`}
            ></span>
          </span>
        </div>

        <AnimatePresence>
          <motion.div
            key="main-view"
            variants={mainViewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full p-5 space-y-4"
          >
            {/* Header Section */}
            <section id="OrderHeader">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 truncate">
                    {order.orderNumber}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order #{order.orderId}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.orderStatus === "fulfilled"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "returned"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.orderStatus?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-100">
                <Avatar
                  src={
                    order.avatar
                      ? `${process.env.REACT_APP_SERVER_URL}/${order.avatar}`
                      : `${process.env.REACT_APP_SERVER_URL}/default.webp`
                  }
                  alt={order.customerName}
                  sx={{ width: 36, height: 36 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {order.customerPhone}
                  </p>
                </div>
              </div>
            </section>

            {/* Amount & Payment Section */}
            <section
              id="AmountPayment"
              className="bg-white rounded-lg p-4 border border-slate-100 space-y-3"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Total Amount
                </span>
                <p className="text-2xl font-bold text-green-600">
                  ₹ {parseFloat(order.totalAmount).toFixed(2)}
                </p>
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {order.paymentStatus === "paid" ? (
                  <>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                      <FiCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-700">
                      Paid
                    </span>
                  </>
                ) : order.paymentStatus === "unpaid" ||
                  order.paymentStatus === "pending" ? (
                  <>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
                      <FiClock className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-amber-700">
                      Awaiting Confirmation
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                      <FiX className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-red-700">
                      {order.paymentStatus?.charAt(0).toUpperCase() +
                        order.paymentStatus?.slice(1)}
                    </span>
                  </>
                )}
              </div>
            </section>

            {/* Order Details Grid */}
            <section id="OrderDetails" className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-slate-100">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-100">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-1">
                  Items
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {order.items?.length || 0}
                </p>
              </div>
              {parseFloat(order.shippingCost) > 0 && (
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-1">
                    Shipping
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    ₹ {parseFloat(order.shippingCost).toFixed(2)}
                  </p>
                </div>
              )}
              {parseFloat(order.discountOnOrder) > 0 && (
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-1">
                    Discount
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    ₹ {parseFloat(order.discountOnOrder).toFixed(2)}
                  </p>
                </div>
              )}
            </section>

            {/* Items Preview */}
            {order.items?.length > 0 && (
              <section
                id="ItemsPreview"
                className="bg-white rounded-lg p-3 border border-slate-100"
              >
                <h3
                  className="text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={toggleItemsVisibility}
                >
                  📦 {order.items.length} Item
                  {order.items.length !== 1 ? "s" : ""} • Click to expand
                </h3>
              </section>
            )}

            {/* Actions Footer */}
            <section
              id="Actions"
              className="pt-2 border-t border-slate-100 mt-auto"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleContextMenu(e);
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                ⋮ More Options
              </button>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Items Expanded View */}
      {isItemsVisible && (
        <section id={"Items"} className="mt-2">
          <ItemSection
            order={order}
            toggleItemsVisibility={toggleItemsVisibility}
            isItemsVisible={isItemsVisible}
          />
        </section>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={handleCloseContextMenu}
        />
      )}

      <OrderTimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        order={order}
        timelineCollapsed={timelineCollapsed}
        toggleTimeline={toggleTimeline}
      />
    </main>
  );
};

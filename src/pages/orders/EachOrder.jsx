import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@mui/material";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
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
            { label: "Cancel", onClick: () => handleChangeOrderStatus(order.orderId, "cancelled") },
            { label: "Fulfilled", onClick: () => handleChangeOrderStatus(order.orderId, "fulfilled") },
          ];
        case "returned":
          return [{ label: "Shipped", onClick: () => handleChangeOrderStatus(order.orderId, "shipped") }];
        case "fulfilled":
          return [{ label: "Returned", onClick: () => handleChangeOrderStatus(order.orderId, "returned") }];
        case "cancelled":
          return [{ label: "Shipped", onClick: () => handleChangeOrderStatus(order.orderId, "shipped") }];
        case "pending":
          return [
            { label: "Ship", onClick: () => handleChangeOrderStatus(order.orderId, "shipped") },
            { label: "Cancel", onClick: () => handleChangeOrderStatus(order.orderId, "cancelled") },
            { label: "Fulfill", onClick: () => handleChangeOrderStatus(order.orderId, "fulfilled") },
            { label: "Return", onClick: () => handleChangeOrderStatus(order.orderId, "returned") },
          ];
        default:
          return [];
      }
    };

    const items = [
      { label: "View Invoice", onClick: () => navigate(`/invoice/${order.orderId}`) },
      { label: "View Timeline", onClick: () => setIsTimelineModalOpen(true) },
      { label: "Edit", onClick: () => navigate(`/orders/${order.orderId}`) },
      {
        label: order.paymentStatus === "pending" ? "Mark Payment" : "Unmark Payment",
        onClick: () => handleMarkPayment(order.orderId, order.paymentStatus !== "paid" ? "paid" : "pending"),
      },
      { label: "Change Status", subItems: getAvailableStatusSubItems(order.orderStatus) },
    ];

    setContextMenu({ x, y, items });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!(event.target).closest(".context-menu")) {
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
      className="flex relative flex-col h-full z-30"
      onContextMenu={handleContextMenu}
    >
      <AnimatePresence>
        <motion.div
          key="main-view"
          variants={mainViewVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <section id="OrderHead" className="z-40">
            <div className="absolute top-3 right-3 z-40">
              <span className="relative flex h-4 w-4">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(
                    order.orderStatus
                  )} opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-4 w-4 ${getStatusColor(
                    order.orderStatus
                  )}`}
                ></span>
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-black text-xl font-bold">Order #{order.orderId}</h1>
            </div>
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-black text-md font-light">{`${initials}-${order.invoiceNumber}`}</h1>
            </div>
            <div className="flex justify-between">
              <p className="text-lg text-green-700 mb-2 font-medium">
                ₹ {parseFloat(order.totalAmount).toFixed(2)}
              </p>
              <p className="text-gray-600 mt-1">{formatDate(order.invoiceDate)}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700 m-2">
              <div className="flex items-center">
                <Avatar
                  src={
                    order.avatar
                      ? `${process.env.REACT_APP_SERVER_URL}/${order.avatar}`
                      : `${process.env.REACT_APP_SERVER_URL}/default.webp`
                  }
                  alt={order.customerName}
                  sx={{ width: 28, height: 28 }}
                />
                <span className="font-medium" style={{ marginLeft: 8 }}>
                  {order.customerName}
                </span>
              </div>
            </div>
          </section>

          <section
            id="Payment"
            className={`flex mt-2 w-full justify-center items-center ${
              order.paymentStatus === "paid" ? "text-emerald-500" : "text-amber-700"
            }`}
          >
            {order.paymentStatus === "paid" ? (
              <div className="flex justify-between">
                <p className="flex flex-col rotate-90">|||</p>
                <span className="mx-2">
                  <TaskAltIcon />
                </span>
                <p className="flex flex-col rotate-90">|||</p>
              </div>
            ) : (
              <div className="flex justify-between">
                <p className="flex flex-col rotate-90">|||</p>
                <span className="mx-2">
                  <WatchLaterIcon />
                </span>
                <p className="flex flex-col rotate-90">|||</p>
              </div>
            )}
          </section>
        </motion.div>
      </AnimatePresence>

      <section id={"Items"} className="h-full p-2 mt-4 w-full">
        <h3
          className="text-center text-rose-600 hover:underline cursor-pointer flex items-center justify-center gap-1"
          onClick={toggleItemsVisibility}
        >
          {order.items.length} Items
        </h3>
        <ItemSection
          order={order}
          toggleItemsVisibility={toggleItemsVisibility}
          isItemsVisible={isItemsVisible}
        />
      </section>

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

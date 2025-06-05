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
import styles from './styles/EachOrder.module.css';

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
    className={styles.main}
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
        className={styles.motionContainer}
      >
        <section id="OrderHead" className={styles.orderHead}>
          <div className={styles.statusWrapper}>
            <span className={styles.statusIndicatorWrapper}>
              <span
                className={`${styles.ping} ${getStatusColor(order.orderStatus)}`}
              />
              <span
                className={`${styles.statusIndicator} ${getStatusColor(order.orderStatus)}`}
              />
            </span>
          </div>

          <div className={styles.orderTitleWrapper}>
            <h1 className={styles.orderTitle}>Order #{order.orderId}</h1>
          </div>

          <div className={styles.invoiceNumberWrapper}>
            <h1 className={styles.invoiceNumber}>
              {`${initials}-${order.invoiceNumber}`}
            </h1>
          </div>

          <div className={styles.priceDateWrapper}>
            <p className={styles.totalAmount}>
              ₹ {parseFloat(order.totalAmount).toFixed(2)}
            </p>
            <p className={styles.invoiceDate}>{formatDate(order.invoiceDate)}</p>
          </div>

          <div className={styles.customerWrapper}>
            <div className={styles.customerInfo}>
              <Avatar
                src={
                  order.avatar
                    ? `${process.env.REACT_APP_SERVER_URL}/${order.avatar}`
                    : `${process.env.REACT_APP_SERVER_URL}/default.webp`
                }
                alt={order.customerName}
                sx={{ width: 28, height: 28 }}
              />
              <span className={styles.customerName}>{order.customerName}</span>
            </div>
          </div>
        </section>

        <section
          id="Payment"
          className={`${styles.paymentSection} ${
            order.paymentStatus === 'paid' ? styles.paid : styles.unpaid
          }`}
        >
          {order.paymentStatus === 'paid' ? (
            <div className={styles.paymentIcons}>
              <p className={styles.rotatedBars}>|||</p>
              <span className={styles.iconWrapper}>
                <TaskAltIcon />
              </span>
              <p className={styles.rotatedBars}>|||</p>
            </div>
          ) : (
            <div className={styles.paymentIcons}>
              <p className={styles.rotatedBars}>|||</p>
              <span className={styles.iconWrapper}>
                <WatchLaterIcon />
              </span>
              <p className={styles.rotatedBars}>|||</p>
            </div>
          )}
        </section>
      </motion.div>
    </AnimatePresence>

    <section id="Items" className={styles.itemsSection}>
      <h3
        className={styles.itemsHeader}
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

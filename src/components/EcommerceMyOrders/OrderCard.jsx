import { useNavigate } from "react-router-dom";
import { FiCheck, FiClock, FiTruck, FiPackage } from "react-icons/fi";
import styles from "./styles/OrderCard.module.css";

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#dea01e";
      case "shipped":
        return "#0db0b4";
      case "returned":
        return "#e74c3c";
      case "fulfilled":
        return "#23ae8d";
      case "cancelled":
        return "#95a5a6";
      default:
        return "#3498db";
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return { label: "Paid", icon: FiCheck, color: "#27ae60" };
      case "unpaid":
      case "pending":
        return { label: "Pending", icon: FiClock, color: "#f39c12" };
      case "partially_paid":
        return { label: "Partial", icon: FiClock, color: "#e67e22" };
      case "refunded":
        return { label: "Refunded", icon: FiCheck, color: "#e74c3c" };
      default:
        return { label: "Unknown", icon: FiClock, color: "#95a5a6" };
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return FiPackage;
      case "shipped":
        return FiTruck;
      case "fulfilled":
        return FiCheck;
      default:
        return FiPackage;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const paymentBadge = getPaymentStatusBadge(order.payment_status);
  const PaymentIcon = paymentBadge.icon;
  const OrderStatusIcon = getOrderStatusIcon(order.order_status);

  return (
    <div className={styles.card}>
      {/* Status Indicator */}
      <div
        className={styles.statusIndicator}
        style={{ backgroundColor: getStatusColor(order.order_status) }}
      ></div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <h4 className={styles.orderId}>{order.order_number}</h4>
          <span className={styles.date}>{formatDate(order.order_date)}</span>
        </div>

        <div className={styles.badges}>
          <span
            className={styles.paymentStatus}
            style={{ borderColor: paymentBadge.color, color: paymentBadge.color }}
          >
            <PaymentIcon size={14} />
            {paymentBadge.label}
          </span>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Left Content */}
        <div className={styles.leftContent}>
          {/* Products Section */}
          {order.items && order.items.length > 0 && (
            <div className={styles.productsSection}>
              <h5 className={styles.productsLabel}>Products</h5>
              <div className={styles.productsList}>
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className={styles.productItem}>
                    <span className={styles.productName}>{item.name || "Product"}</span>
                    <span className={styles.productQty}>x{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className={styles.moreItems}>
                    +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amount Section */}
          <div className={styles.amountSection}>
            <div className={styles.priceRow}>
              <span className={styles.label}>Total Amount</span>
              <span className={styles.amount}>
                ₹{parseFloat(order.total_amount).toFixed(2)}
              </span>
            </div>
            {parseFloat(order.discount_on_order) > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.label}>Discount</span>
                <span className={styles.discount}>
                  -₹{parseFloat(order.discount_on_order).toFixed(2)}
                </span>
              </div>
            )}
            {parseFloat(order.shipping_cost) > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.label}>Shipping</span>
                <span className={styles.shipping}>
                  ₹{parseFloat(order.shipping_cost).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Reward Points */}
          {order.reward_points_earned > 0 && (
            <div className={styles.rewardPoints}>
              ⭐ +{order.reward_points_earned} Reward Points
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className={styles.rightActions}>
          <button 
            className={styles.secondary}
            onClick={() => navigate(`/customer/orders/${order.id}`)}
          >
            View Details
          </button>
          <button className={styles.primary}>Reorder</button>
        </div>
      </div>
    </div>
  );
}

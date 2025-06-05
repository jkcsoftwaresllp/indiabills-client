import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ModalMaker from "../../components/core/ModalMaker";
import styles from './styles/OrderTimelineModal.module.css';

const OrderTimelineModal = ({
  isOpen,
  onClose,
  order,
  timelineCollapsed,
  toggleTimeline,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#dea01e]';
      case 'shipped':
        return 'bg-[#0db0b4]';
      case 'returned':
        return 'bg-red-500';
      case 'fulfilled':
        return 'bg-[#23ae8d]';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-white';
    }
  };

 return (
  <ModalMaker isOpen={isOpen} onClose={onClose}>
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Order Timeline</h2>
      <section id="Timeline" className={styles.timelineContainer}>
        <button
          className={styles.toggleButton}
          onClick={() => toggleTimeline(order.orderId)}
          aria-expanded={!timelineCollapsed[order.orderId]}
          aria-controls="timeline-list"
        >
          {timelineCollapsed[order.orderId] ? (
            <>
              <ExpandMoreIcon /> Show Timeline
            </>
          ) : (
            <>
              <ExpandLessIcon /> Hide Timeline
            </>
          )}
        </button>

        {!timelineCollapsed[order.orderId] && (
          <div className={styles.timelineList} id="timeline-list">
            {order.statusHistory && order.statusHistory.length > 0 ? (
              order.statusHistory.map((status, index) => (
                <li key={index} className={styles.timelineListItem}>
                  <div className={styles.statusItem}>
                    <div
                      className={`${styles.statusDot} ${getStatusColor(status.status)}`}
                      aria-hidden="true"
                    ></div>
                    <p className={styles.statusText}>
                      {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                    </p>
                  </div>
                  <p className={styles.dateText}>
                    {new Date(status.updatedAt).toLocaleString()}
                  </p>
                </li>
              ))
            ) : (
              <p className={styles.noHistory}>No status history available.</p>
            )}
          </div>
        )}
      </section>
    </div>
  </ModalMaker>
);
};

export default OrderTimelineModal;

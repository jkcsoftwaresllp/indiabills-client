import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles/Modal.module.css';

const Modal = ({ children, onClose }) => {
   return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close modal when clicking outside
      >
        <motion.div
          className={styles.modalContent}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById('modal-root')
  );
};

const ItemSection = ({ order, toggleItemsVisibility, isItemsVisible }) => {
  return (
    <div className={styles.itemSectionContainer}>
      <div
        className={styles.toggleButtonWrapper}
        onClick={toggleItemsVisibility}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') toggleItemsVisibility();
        }}
        aria-expanded={isItemsVisible}
        aria-controls="items-modal"
      >
        {!isItemsVisible && (
          <section id="item-button" className={styles.itemButtonSection}>
            <h3
              className={`${styles.itemButtonText} ${styles.itemButtonTextHover}`}
              onClick={toggleItemsVisibility}
            >
              {order.items.length} Items
              <KeyboardArrowUpIcon
                className={`${styles.iconRotate} ${
                  isItemsVisible ? styles.iconRotateOpen : ''
                }`}
              />
            </h3>
          </section>
        )}
      </div>

      {isItemsVisible && (
        <Modal onClose={toggleItemsVisibility}>
          <button
            onClick={toggleItemsVisibility}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className={styles.itemsTitle}>Items:</h2>
          {order.items.map((item) => (
            <div key={item.orderItemId} className={styles.itemContainer}>
              <div>
                <h1 className={styles.itemName}>
                  {item.itemName}{' '}
                  <span className={styles.itemId}>#{item.itemId}</span>
                </h1>
                {item.variants && Object.keys(item.variants).length > 0 && (
                  <div className={styles.variantText}>
                    {Object.entries(item.variants)
                      .filter(([key]) => key !== 'quantity')
                      .map(([key, value]) => `${key}: ${String(value)}`)
                      .join('; ')}
                  </div>
                )}
              </div>
              <div>
                <p className={styles.priceText}>
                  {parseFloat(item.salePrice.toString()).toFixed(2)}
                </p>
                <p className={styles.quantityText}>
                  <span className={styles.quantityPrefix}>x</span>
                  {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

export default ItemSection;
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Close modal when clicking outside
      >
        <motion.div
          className="bg-white rounded-md overflow-auto max-h-[80vh] w-[90vw] md:w-[60vw] p-4 relative"
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
    <div className='static hidden'>
      <div
        className='border-2 border-rose-500 min-h-24 flex flex-col gap-4 relative overflow-hidden cursor-pointer'
        onClick={toggleItemsVisibility}
      >
        {!isItemsVisible && (
          <section id="item-button" className="h-full p-2 mt-4">
            <h3
              className="text-center text-rose-600 hover:underline cursor-pointer flex items-center justify-center gap-1"
              onClick={toggleItemsVisibility}
            >
              {order.items.length} Items
              <KeyboardArrowUpIcon
                className={`transition-transform duration-300 ${
                  isItemsVisible ? "transform rotate-180" : ""
                }`}
              />
            </h3>
          </section>
        )}
      </div>

      {/* Modal for expanded items */}
      {isItemsVisible && (
        <Modal onClose={toggleItemsVisibility}>
          <button
            onClick={toggleItemsVisibility}
            className="absolute top-4 right-4 text-xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold mb-4">Items:</h2>
          {order.items.map((item) => (
            <div
              key={item.orderItemId}
              className="p-3 grid grid-cols-2 bg-[#ffffff] border rounded-md mb-2"
            >
              <div>
                <h1 className="capitalize font-medium">
                  {item.itemName} <span className="font-light">#{item.itemId}</span>
                </h1>
                {item.variants && Object.keys(item.variants).length > 0 && (
                  <div className="text-sm text-gray-500 capitalize">
                    {Object.entries(item.variants)
                      .filter(([key]) => key !== 'quantity')
                      .map(([key, value]) => `${key}: ${String(value)}`)
                      .join('; ')}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-green-800">
                  {parseFloat(item.salePrice.toString()).toFixed(2)}
                </p>
                <p className="text-gray-500 font-medium">
                  <span className="text-sm">x</span>
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
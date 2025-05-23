import zIndex from "@mui/material/styles/zIndex";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalMaker: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={"modal-bg fixed inset-0 flex justify-center items-center"}
          style={{ zIndex: '5000' }}
          onClick={handleOverlayClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div
            className="p-2 rounded-lg bg-transparent max-w-lg"
            style={{ zIndex: '5001' }}
            variants={modalVariants}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ModalMaker;
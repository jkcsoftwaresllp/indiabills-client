import { FiX, FiCheck } from "react-icons/fi";
import styles from './Modal.module.css';

const Modal = ({ handleClose, open, title, children, submit }) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            title="Close"
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {children}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={styles.submitButton}
            onClick={submit}
          >
            <FiCheck />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

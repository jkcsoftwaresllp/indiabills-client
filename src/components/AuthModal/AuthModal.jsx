import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthModal.module.css";

export default function AuthModal({ isOpen, onClose, domain = "indiabills" }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate(`/register/${domain}`);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={handleCancel}>
          <X size={24} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h2>Sign In to Your Account</h2>
          {/* <p>Access your cart, wishlist, and orders</p> */}
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.description}>
            Please sign in or create a new account to continue shopping. This helps us keep your cart and wishlist safe.
          </p>

          {/* Button Group */}
          <div className={styles.buttonGroup}>
            <button className={styles.loginBtn} onClick={handleLogin}>
              <span className={styles.btnText}>Sign In</span>
              <span className={styles.btnSubtext}>Already have an account?</span>
            </button>

            <button className={styles.signupBtn} onClick={handleSignup}>
              <span className={styles.btnText}>Create Account</span>
              <span className={styles.btnSubtext}>New to India Bills?</span>
            </button>
          </div>

          {/* Cancel Link */}
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Continue Shopping
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>We never share your information with anyone.</p>
        </div>
      </div>
    </div>
  );
}

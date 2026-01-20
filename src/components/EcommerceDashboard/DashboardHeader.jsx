import styles from "./styles/DashboardHeader.module.css";
import { ShoppingBag, ShoppingCart, Heart } from "lucide-react";
import indiaBillsLogo from "../../assets/IndiaBills_logo.png";

export default function DashboardHeader({ user, stats }) {
  return (
    <header className={styles.header}>
      {/* LEFT */}
      <div className={styles.left}>
        {/* Logo */}
        <img
          src={indiaBillsLogo}
          alt="IndiaBills"
          className={styles.logo}
        />

        <div className={styles.userBlock}>
          <img
            src={user.avatar}
            alt="User Avatar"
            className={styles.avatar}
          />

          <div className={styles.userText}>
            <h1>Welcome back, {user.name} 👋</h1>
            <p>Your shopping hub at one place</p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.stats}>
        <Stat icon={ShoppingBag} label="Orders" value={stats.orders} />
        <Stat icon={ShoppingCart} label="Cart" value={stats.cart} />
        <Stat icon={Heart} label="Wishlist" value={stats.wishlist} />
      </div>
    </header>
  );
}

function Stat({ icon: Icon, label, value, onClick }) {
  return (
    <div
      className={styles.statCard}
      onClick={onClick}
      role="button"
    >
      <div className={styles.statIcon}>
        <Icon size={18} />
      </div>

      <div className={styles.statInfo}>
        <span>{value}</span>
        <p>{label}</p>
      </div>
    </div>
  );
}

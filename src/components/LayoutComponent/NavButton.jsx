import { NavLink, useLocation, matchPath } from "react-router-dom";
import { Button } from "@mui/material";
import styles from './styles/NavButton.module.css';

const NavButton = ({ to, icon, onclick, color, type, label }) => {
  const location = useLocation();
  const isActive = !!matchPath(location.pathname, to);

  return (
  <NavLink
    to={to}
    className={({ isActive, isPending }) => {
      if (isActive) {
        return `${styles.active} ${
          color === 'error' ? styles.activeError : styles.activeAccent
        }`;
      }
      if (isPending) {
        return `${styles.navLink} ${styles.navLinkHoverPending}`;
      }
      return `${styles.navLink} ${styles.navLinkHover}`;
    }}
  >
    <Button
      startIcon={icon}
      variant="text"
      onClick={onclick}
      color="inherit"
      sx={{
        color: 'inherit', // inherit color, we'll override dynamically below
        textTransform: 'none',
        fontSize: 16,
      }}
      style={{
        color: window.location.pathname === to
          ? '#e0f2fe' // active color (light blue)
          : color,
      }}
    >
      {label}
    </Button>
  </NavLink>
);
};

export default NavButton;

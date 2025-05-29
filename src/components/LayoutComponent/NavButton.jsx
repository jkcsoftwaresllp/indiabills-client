import { NavLink, useLocation, matchPath } from "react-router-dom";
import { Button } from "@mui/material";

const NavButton = ({ to, icon, onclick, color, type, label }) => {
  const location = useLocation();
  const isActive = !!matchPath(location.pathname, to);

  return (
    <NavLink
      className={({ isActive, isPending }) => {
        return isActive
          ? color === "error"
            ? "active mx-6 bg-red-100 rounded-lg p-px transition ease-out translate-y-1 scale-110 duration-300 "
            // : "active mx-6 bg-[#ff5159] rounded-lg p-px transition ease-out translate-y-1 scale-110 duration-300 "
            : "active mx-6 idms-accent-transparent-bg rounded-lg p-px transition ease-out translate-y-1 scale-110 duration-300 "
          : isPending
          ? "mx-6 pending transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 "
          : "mx-6 transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300 ";
      }}
      to={to}
    >
      <Button
        startIcon={icon}
        variant="text"
        onClick={onclick}
        color="inherit"
        sx={{ color: isActive ? '#e0f2fe' : color, textTransform: "none", fontSize: 16 }}
        // sx={{ color: isActive ? '#fff6f2' : color, textTransform: "none", fontSize: 16 }}
      >
        {label}
      </Button>
    </NavLink>
  );
};

export default NavButton;

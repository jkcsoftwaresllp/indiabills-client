import { lazy, Suspense } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "../store/context";
import ProtectedRoute from "./protectedRoutes";
import SpinnerFullPage from "../pages/more/spinner";

// HOME
import LoginPage from "../pages/user/Login";
import Register from "../pages/user/Register";

// DASHBOARD
import Home from "../pages/interfaces/Home";

// SETUP
import StartSetup from "../pages/setup/Setup";
import SetupPage from "../pages/setup/SetupPage";

import CustomerRoutes from "./customerRoutes";

const Routing = () => {
  const location = useLocation();

  // @formatter:off
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes location={location} key={location.pathname}>
            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* SETUP */}
            <Route path="/setup" element={<StartSetup />} />
            <Route
              path="/setup-page"
              element={<ProtectedRoute element={SetupPage} roles={["admin"]} />}
            />

            {/* USER */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />

            {/* CUSTOMER PORTAL */}
            <Route path="/customer/*" element={<CustomerRoutes />} />

            <Route path="*" element={<>404 Route Not Found</>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default Routing;

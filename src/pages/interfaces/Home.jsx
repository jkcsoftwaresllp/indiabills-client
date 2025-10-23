import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import HomeAdmin from "./AdminInterface/HomeAdmin";
import DashboardReporter from "./ReporterInterface/HomeReporter";
import DashboardCustomer from "./CustomerInterface/HomeCustomer";
import DashboardOperator from "./OperatorInterface/HomeOperator";
import DashboardDelivery from "./DeliveryInterface/HomeDelivery";

const Home = () => {
  const { user } = useAuth();

  switch (user?.role) {
  case "admin":
  return <HomeAdmin />;
  case "systems":
  return <HomeAdmin />;
  case "operator":
  return <DashboardOperator />;
  case "manager":
  return <Navigate to="/manager" replace />;
  case "reporter":
  return <DashboardReporter />;
  case "delivery":
  return <DashboardDelivery />;
  case "customer":
  return <DashboardCustomer />;
    default:
      return <>TODO : Need to Implement, Ask Backend to implement the API</>;
  }
};

export default Home;

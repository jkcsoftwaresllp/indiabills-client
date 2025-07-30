import { useAuth } from "../../hooks/useAuth";
import HomeAdmin from "./AdminInterface/HomeAdmin";
import DashboardReporter from "./ReporterInterface/HomeReporter";
import DashboardCustomer from "./CustomerInterface/HomeCustomer";
import DashboardOperator from "./OperatorInterface/HomeOperator";
import DashboardDelivery from "./DeliveryInterface/HomeDelivery";

const Home = () => {
  const { user } = useAuth();

  //   switch (user?.role) {
  switch ("TODO") {
    case "admin":
      return <HomeAdmin />;
    case "operator":
      return <DashboardOperator />;
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

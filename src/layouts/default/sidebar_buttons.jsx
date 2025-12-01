import {
  FiHeadphones,
  FiGrid,
  FiBarChart2,
  FiClock,
  FiBook,
  FiUsers,
  FiList,
  FiTool,
  FiTag,
  FiCreditCard,
  FiTruck,
  FiShoppingCart,
  FiFileText,
  FiShoppingBag,
  FiSettings,
  FiTrendingUp,
  FiBox,
  FiHelpCircle,
} from "react-icons/fi";

export default [
  {
    to: "/",
    icon: <FiGrid />,
    label: "Dashboard",
    roles: ["admin", "operator"],
  },
  {
    to: "/reports",
    icon: <FiBarChart2 />,
    label: "Reports",
    roles: ["admin"],
  },
  {
    group: "Management",
    items: [
      {
        to: "/channel",
        icon: <FiClock />,
        label: "Channel",
        roles: ["admin", "operator", "reporter", "delivery"],
      },
      // {
      //   to: "/audit/log",
      //   icon: <FiBook />,
      //   label: "Audit Log",
      //   roles: ["admin"],
      // },
      {
        to: "/users",
        icon: <FiUsers />,
        label: "Users",
        roles: ["admin"],
      },
    ],
  },
  {
    group: "Operations",
    items: [
      {
        to: "/products",
        icon: <FiList />,
        label: "Products",
        roles: ["admin", "operator"],
      },
      {
        to: "/suppliers",
        icon: <FiTool />,
        label: "Suppliers",
        roles: ["admin", "operator"],
      },
      {
        to: "/inventory",
        icon: <FiBox />,
        label: "Inventory",
        roles: ["admin", "operator"],
      },
      {
        to: "/offers",
        icon: <FiTag />,
        label: "Offers",
        roles: ["admin", "operator"],
      },
      {
        to: "/customers",
        icon: <FiUsers />,
        label: "Customers",
        roles: ["admin", "operator"],
      },
      {
        to: "/payments",
        icon: <FiCreditCard />,
        label: "Payments",
        roles: ["admin", "manager", "operator"],
      },
      {
        to: "/transport",
        icon: <FiTruck />,
        label: "Transport",
        roles: ["admin", "operator", "delivery"],
      },
    ],
  },
  {
    group: "Shop",
    items: [
      {
        to: "/orders",
        icon: <FiShoppingCart />,
        label: "Orders",
        roles: ["admin", "operator", "delivery"],
      },
      {
        to: "/invoices",
        icon: <FiFileText />,
        label: "Invoices",
        roles: ["admin"],
      },
      {
        to: "/shop",
        icon: <FiShoppingBag />,
        label: "Shop",
        roles: ["admin", "operator", "customer"],
      },
      {
        to: "/support",
        icon: <FiHelpCircle />,
        label: "Customer Support",
        roles: ["customer"],
      },
    ],
  },
  {
        to: "/setup-page",
        icon: <FiSettings />,
        label: "Setup",
        roles: ["admin"],
      },
      {
        to: "/subscriptions",
        icon: <FiTrendingUp />,
        label: "Subscription",
        roles: ["admin"],
  },
];

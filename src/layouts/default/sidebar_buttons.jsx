// sidebar_buttons.jsx
import ReceiptIcon from '@mui/icons-material/Receipt';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShopIcon from '@mui/icons-material/Shop';
import SupportIcon from '@mui/icons-material/Support';
import SettingsIcon from '@mui/icons-material/Settings';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import PaymentIcon from '@mui/icons-material/Payment';

export default [
  {
    group: 'Dashboard',
    items: [
      {
        to: '/',
        icon: <SpaceDashboardRoundedIcon />,
        label: 'Dashboard',
        roles: ['admin', 'operator'],
      },
      {
        to: '/reports',
        icon: <AssessmentIcon />,
        label: 'Reports',
        roles: ['admin'],
      },
    ],
  },
  {
    group: 'Management',
    items: [
      {
        to: '/channel',
        icon: <UpcomingIcon />,
        label: 'Channel',
        roles: ['admin', 'operator', 'reporter', 'delivery'],
      },
      {
        to: '/audit/log',
        icon: <LibraryBooksIcon />,
        label: 'Audit Log',
        roles: ['admin'],
      },
      {
        to: '/users',
        icon: <ManageAccountsIcon />,
        label: 'Users',
        roles: ['admin'],
      },
    ],
  },
  {
    group: 'Operations',
    items: [
      {
        to: '/products',
        icon: <CategoryRoundedIcon />,
        label: 'Products',
        roles: ['admin', 'operator'],
      },
      {
        to: '/suppliers',
        icon: <PrecisionManufacturingIcon />,
        label: 'Suppliers',
        roles: ['admin', 'operator'],
      },
      {
        to: '/inventory',
        icon: <Inventory2RoundedIcon />,
        label: 'Inventory',
        roles: ['admin', 'operator'],
      },
      {
        to: '/offers',
        icon: <LocalOfferRoundedIcon />,
        label: 'Offers',
        roles: ['admin', 'operator'],
      },
      {
        to: '/customers',
        icon: <SupervisedUserCircleIcon />,
        label: 'Customers',
        roles: ['admin', 'operator'],
      },
      {
        to: '/payments',
        icon: <PaymentIcon />,
        label: 'Payments',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        to: '/transport',
        icon: <LocalShippingRoundedIcon />,
        label: 'Transport',
        roles: ['admin', 'operator', 'delivery'],
      },
    ],
  },
  {
    group: 'Shop',
    items: [
      {
        to: '/orders',
        icon: <ShoppingCartIcon />,
        label: 'Orders',
        roles: ['admin', 'operator', 'delivery'],
      },
      {
        to: '/invoices',
        icon: <ReceiptIcon />,
        label: 'Invoices',
        roles: ['admin'],
      },
      {
        to: '/shop',
        icon: <ShopIcon />,
        label: 'Shop',
        roles: ['admin', 'operator', 'customer'],
      },
      {
        to: '/support',
        icon: <SupportIcon />,
        label: 'Customer Support',
        roles: ['customer'],
      },
    ],
  },
  {
    group: 'Setup Dashboard',
    items: [
      {
        to: '/setup-page',
        icon: <SettingsIcon />, 
        label: 'Setup',
        roles: ['admin'], 
      },
      {
        to: '/subscription',
        icon: <SubscriptionsIcon />,
        label: 'Subscription',
        roles: ['admin'],
      },
    ],
  },
];

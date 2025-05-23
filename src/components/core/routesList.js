// routesList.js

const routesList = [
    // HOME
    { path: '/', label: 'Home' },
    { path: '/channel', label: 'Organization > Channel' },
    
    // SETUP
    { path: '/setup', label: 'Setup' },
  
    // SUPPORT
    { path: '/help', label: 'Support > Help' },
    { path: '/settings', label: 'Support > Settings' },
    { path: '/options', label: 'Support > Options Editor' },
    { path: '/contact', label: 'Support > Contact Us' },
  
    // PRODUCTS
    { path: '/products', label: 'Products > View Products' },
    { path: '/products/add', label: 'Products > Add Products' },
    // For dynamic routes, use a placeholder
    { path: '/products/:itemId', label: 'Products > Inspect Product' },
  
    // CUSTOMERS
    { path: '/customers', label: 'Customers > View Customers' },
    { path: '/customers/add', label: 'Customers > Add Customers' },
    { path: '/customers/address/add/:customerId', label: 'Customers > Add Address' },
    { path: '/customers/:customerId', label: 'Customers > Inspect Customer' },
    { path: '/customers/edit/:customerId', label: 'Customers > Edit Customer' },
    { path: '/customers/address/:addressId', label: 'Customers > Edit Address' },
  
    // TRANSPORT
    { path: '/transport', label: 'Transport > View Transport' },
    { path: '/transport/add', label: 'Transport > Add Transport' },
    { path: '/transport/:transportId', label: 'Transport > Inspect Transport' },
  
    // OFFERS
    { path: '/offers', label: 'Offers > View Offers' },
    { path: '/offers/add', label: 'Offers > Add Offer' },
    { path: '/offers/:offerId', label: 'Offers > Inspect Offer' },
  
    // USERS
    { path: '/login', label: 'Login' },
    { path: '/users', label: 'Users > View Users' },
    { path: '/users/add', label: 'Users > Add User' },
    { path: '/users/:userID', label: 'Users > Inspect User' },
  
    // ORGANIZATION
    { path: '/organization', label: 'Organization > View Organization' },
    { path: '/organization/edit', label: 'Organization > Edit Organization' },
  
    // SUPPLIERS
    { path: '/suppliers', label: 'Suppliers > View Suppliers' },
    { path: '/suppliers/add', label: 'Suppliers > Add Supplier' },
    { path: '/suppliers/:supplierId', label: 'Suppliers > Inspect Supplier' },
  
    // INVENTORY
    { path: '/inventory', label: 'Inventory > View Inventory' },
    { path: '/inventory/add', label: 'Inventory > Add Inventory' },
    { path: '/inventory/:batchId', label: 'Inventory > Edit Inventory' },
  
    // INVOICES
    { path: '/invoices', label: 'Invoices > View Invoices' },
    { path: '/invoices/edit/:invoiceId', label: 'Invoices > Edit Invoice' },
    { path: '/invoice/:orderId', label: 'Invoices > Order Invoice' },
  
    // SHOP & ORDERS
    { path: '/shop', label: 'Shop' },
    { path: '/orders', label: 'Orders > View Orders' },
    { path: '/orders/:orderId', label: 'Orders > Inspect Order' },
    { path: '/cart', label: 'Cart > Place Order' },
    { path: '/shop/payment/:randomLink', label: 'Shop > Payment Gateway' },
  
    // REPORTS
    { path: '/reports', label: 'Reports > View Reports' },
    { path: '/reports/stocklevel', label: 'Reports > Stock Level' },
    { path: '/reports/supplierperformance', label: 'Reports > Supplier Performance' },
    { path: '/reports/salessummary', label: 'Reports > Sales Summary' },
    { path: '/reports/invoice', label: 'Reports > Invoice Report' },
    { path: '/reports/customerpurchase', label: 'Reports > Customer Purchase' },
    { path: '/reports/credits', label: 'Reports > Credit Report' },
    { path: '/reports/promotionalperformance', label: 'Reports > Promotional Performance' },
    { path: '/reports/stockissue', label: 'Reports > Stock Issue' },
    { path: '/reports/expenses', label: 'Reports > Expense Report' },
    { path: '/reports/revenue', label: 'Reports > Revenue Report' },
    { path: '/audit/log', label: 'Audit > View Logs' },
  ];
  
  export default routesList;
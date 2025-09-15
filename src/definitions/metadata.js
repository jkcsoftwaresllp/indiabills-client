// PRODUCTS
export const ItemMetadata = [
    // { name: "itemId", type: "number", label: "Item ID", placeholder: "ID", category: "Basic Info", readonly: true, autocomplete: false, required: true, toAdd: true },
    { name: "itemName", type: "string", label: "Item Name", placeholder: "Name", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "description", type: "string", label: "Description", placeholder: "Description", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "category", type: "string", label: "Category", placeholder: "Category", category: "Basic Info", autocomplete: true, required: true, readonly: false, toAdd: true },
    { name: "dimensions", type: "string", label: "Dimensions", placeholder: "Dimensions", category: "Specifications", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "weight", type: "number", label: "Weight", placeholder: "Weight", category: "Specifications", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "manufacturer", type: "string", label: "Manufacturer", placeholder: "Manufacturer", category: "Specifications", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "reorderLevel", type: "number", label: "Reorder Level", placeholder: "Level", category: "Inventory", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "loadingPrice", type: "number", label: "Loading Price", placeholder: "₹", category: "Pricing", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "unloadingPrice", type: "number", label: "Unloading Price", placeholder: "₹", category: "Pricing", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "marketer", type: "string", label: "Marketer", placeholder: "Marketer", category: "Vendor Information", autocomplete: false, required: false, readonly: false, toAdd: true },
    { name: "ongoingOffer", type: "boolean", label: "Ongoing Offer", placeholder: "", category: "Vendor Information", autocomplete: true, required: true, readonly: false, toAdd: true },
    { name: "cgst", type: "number", label: "CGST", placeholder: "₹", category: "Taxation", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "sgst", type: "number", label: "SGST", placeholder: "₹", category: "Taxation", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "cess", type: "number", label: "CESS", placeholder: "CESS", category: "Taxation", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "upc", type: "string", label: "UPC", placeholder: "UPC", category: "Additional Info", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "hsn", type: "string", label: "HSN", placeholder: "HSN", category: "Additional Info", autocomplete: false, required: true, readonly: false, toAdd: true },
    { name: "packSize", type: "number", label: "Pack Size", placeholder: "Size", category: "Inventory", autocomplete: false, required: true, readonly: false, toAdd: true },
    // { name: "variants", type: "object[]", label: "Variants", placeholder: "", category: "Vendor Information", autocomplete: false, required: false, readonly: false, toAdd: false, },

    // { name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false },
    // { name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false },
    // { name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false },
    // { name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false },
  ];

// SUPPLIER
export const SupplierMetadata = [
    /* About */
    {name: "supplierId", type: "string", label: "Supplier ID", placeholder: "ID", category: "Basic Info", readonly: true, autocomplete: false},
    { name: "supplierName", type: "string", label: "Supplier Name", placeholder: "", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "businessName", type: "string", label: "Business Name", placeholder: "", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "email", type: "string", label: "Email", placeholder: "example@domain.com", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "mobileNumber", type: "number", label: "Mobile Number", placeholder: "", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "alternateMobileNumber", type: "number", label: "Alternate Mobile Number", placeholder: "-", category: "About", autocomplete: false , required: false, readonly: false, toAdd: true},

    /* Address Details */
    { name: "addressLine1", type: "string", label: "Address Line 1", placeholder: "Plot no. & Office Building", category: "Address Details", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "addressLine2", type: "string", label: "Address Line 2", placeholder: "Street, District, Landmark", category: "Address Details", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "city", type: "string", label: "City", placeholder: "Patna, Delhi, etc.", category: "Address Details", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "state", type: "string", label: "State", placeholder: "", category: "Address Details", autocomplete: true, required: true, readonly: false, toAdd: true},
    { name: "pinCode", type: "number", label: "Pin Code", placeholder: "XXXXXX", category: "Address Details", autocomplete: false , required: true, readonly: false, toAdd: true},

    /* Other */
    { name: "beneficiaryName", type: "string", label: "Beneficiary Name", placeholder: "", category: "Payment Method", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "accountNumber", type: "string", label: "Account Number", placeholder: "XXXXXXXXX", category: "Payment Method", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "ifscCode", type: "string", label: "IFSC Code", placeholder: "XXXXXXXXX", category: "Payment Method", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "virtualPaymentAddress", type: "string", label: "Virtual Payment Address", placeholder: "XXXXXXXXX", category: "Payment Method", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "remarks", type: "string", label: "Remarks", placeholder: "Comment on this entry.", category: "Payment Method", autocomplete: false , required: false, readonly: false, toAdd: true},

    /* Additional Fields */
    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
];

// TRANSPORT
export const TransportMetadata = [
    /* BASIC INFO */
    {name: "transportId", type: "string", label: "Transport ID", placeholder: "Transport ID", category: "Basic Info", readonly: true, autocomplete: false},
    { name: "transportName", type: "string", label: "Transport Name", placeholder: "", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "businessName", type: "string", label: "Business Name", placeholder: "", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "vehicleName", type: "string", label: "Vehicle Name", placeholder: "", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "email", type: "string", label: "Email", placeholder: "example@domain.com", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "mobileNumber", type:"number", label:"Mobile Number", placeholder:"XXXXXX", category:"Basic", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "alternateMobileNumber", type:"number", label:"Alternate Mobile Number", placeholder:"XXXXXX", category:"Basic", autocomplete: false, required: false, readonly: false, toAdd: true},
    { name: "status", type:"string", label:"Status", placeholder:"Active/Inactive", category:"Basic", autocomplete: true, required: true, readonly: false, toAdd: true},
    /* ADDRESS DETAILS*/
    { name: "addressLine1", type:"string", label:"Address Line 1", placeholder:"", category:"Address", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "addressLine2", type:"string", label:"Address Line 2", placeholder:"", category:"Address", autocomplete: false, required: false, readonly: false, toAdd: true},
    { name: "landmark", type:"string", label:"Landmark", placeholder:"", category:"Address", autocomplete: false, required: false, readonly: false, toAdd: true},
    { name: "city", type:"string", label:"City", placeholder:"", category:"Address", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "district", type:"string", label:"District", placeholder:"", category:"Address", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "state", type:"string", label:"State", placeholder:"", category:"Address", autocomplete: true, required: true, readonly: false, toAdd: true},
    { name: "pinCode", type:"number", label:"Pin Code", placeholder:"123456", category:"Address", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "branchOffice", type:"string", label:"Branch Office", placeholder:" Office", category:"Address", autocomplete: false, required: true, readonly: false, toAdd: true},

    /* Driver Details */
    { name: "aadharNumber", type:"number", label:"Aadhar Number", placeholder:"1234567890", category:"Driver Details", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "panNumber", type:"number", label:"Pan Number", placeholder:"1234567890", category:"Driver Details", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "driverName", type:"string", label:"Driver Name", placeholder:" Name", category:"Driver Details", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "driverMobileNumber", type:"number", label:"Driver Mobile Number", placeholder:"1234567890", category:"Driver Details", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "driverAlternateNumber", type:"number", label:"Driver Alternate Number", placeholder:"1234567890", category:"Driver Details", autocomplete: false, required: false, readonly: false, toAdd: true},

    /* Additional Info */
    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
];

// OFFERS
export const OfferMetadata = [
    /* BASIC INFO */
    { name: "offerId", type: "string", label: "Offer ID", placeholder: "Offer ID", category: "Basic Info", readonly: true, autocomplete: false},
    { name: "offerName", type: "string", label: "Offer Name", placeholder: "", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "startDate", type: "date", label: "Start Date", placeholder: "DD/MM/YYYY", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "endDate", type: "date", label: "End Date", placeholder: "DD/MM/YYYY", category: "Basic", autocomplete: false , required: true, readonly: false, toAdd: true},

    /* Offer Details */
    { name: "offers", type: "string", label: "Offers", placeholder: "Buy 1 Get None Free", category: "Offer Details", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "offerApplicabilityFrequency", type: "string", label: "Frequency", placeholder: "Daily/Weekly/Monthly", category: "Offer Details", autocomplete: true , required: true, readonly: false, toAdd: true},
    // { name: "applicableTo", type: "string", label: "Applicable To", placeholder: "All/Selected", category: "Offer Details", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "status", type: "string", label: "Status", placeholder: "Active/Inactive", category: "Offer Details", autocomplete: true , required: true, readonly: false, toAdd: true},

    /* Discount Details */
    { name: "discountValue", type: "number", label: "Discount Value", placeholder: "₹", category: "Discount Details", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "discountPercentage", type: "number", label: "Discount Percentage", placeholder: "%", category: "Discount Details", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "maximumDiscountValue", type: "number", label: "Maximum Discount Value", placeholder: "₹", category: "Discount Details", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "minimumPurchase", type: "number", label: "Minimum Purchase", placeholder: "₹", category: "Discount Details", autocomplete: false , required: true, readonly: false, toAdd: true},

    /* Additional Info */
    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
];

// CUSTOMERS
export const CustomerMetadata = [
    /* ABOUT */
    {name: "customerId", type: "string", label: "Supplier ID", placeholder: "ID", category: "Basic Info", readonly: true, autocomplete: false},
    { name: "customerName", type: "string", label: "Customer Name", placeholder: "name", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "businessName", type: "string", label: "Business Name", placeholder: "business", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "email", type: "string", label: "Email", placeholder: "example@domain.com", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "mobile", type: "number", label: "Mobile Number", placeholder: "", category: "About", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "alternateMobile", type: "number", label: "Alternate Mobile Number", placeholder: "-", category: "About", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "status", type: "string", label: "Status", placeholder: "Active/Inactive", category: "About", autocomplete: true , required: true, readonly: false, toAdd: true},

    /* REGISTRATION DETAILS */
    { name: "gstin", type: "string", label: "GSTIN", placeholder: "xxxxx xxxxx xxxxx", category: "Verification", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "fssai", type: "string", label: "FSSAI", placeholder: "xxxx xxx xxxxxxx", category: "Verification", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "registrationNumber", type: "string", label: "Registration Number", placeholder: "xxxxxxxxx", category: "Verification", autocomplete: false, required: false, readonly: false, toAdd: true},
    { name: "aadharNumber", type: "number", label: "Aadhar Number", placeholder: "xxxx xxxx xxxx", category: "Verification", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "panNumber", type: "string", label: "PAN Number", placeholder: "xxxx xx xxxx", category: "Verification", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "otherDocuments", type: "string", label: "Other Documents", placeholder: "...", category: "Verification", autocomplete: false , required: false, readonly: false, toAdd: true},

    /* SHIPPING ADDRESS */ // ...will be added in a different table; not Customer.
    { name: "addressType", type: "string", label: "Category", placeholder: "Home, Office, Warehouse 1?", category: "Shipping", autocomplete: true, required: true, readonly: false, toAdd: true},
    { name: "addressLine", type: "string", label: "Address", placeholder: "Plot no. or other details", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "landmark", type: "string", label: "Landmark", placeholder: "Nearby what?", category: "Shipping", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "city", type: "string", label: "City", placeholder: "Patna, Delhi, etc.", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "district", type: "string", label: "District", placeholder: "Specify district or area", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "state", type: "string", label: "State", placeholder: "", category: "Shipping", autocomplete: true , required: true, readonly: false, toAdd: true},
    { name: "pinCode", type: "number", label: "Pin Code", placeholder: "xxxxxx", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},

    /* Additional Info */
    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
];

// USERS
export const UserMetadata = [
    // About User
    { name: "userName", type: "string", label: "User Name", placeholder: "Ram Patel", category: "About User", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "mobile", type: "number", label: "Mobile", placeholder: "XXXXXXXXXX", category: "About User", autocomplete: false, required: false, readonly: false, toAdd: true},
    { name: "avatar", type: "string", label: "Avatar", placeholder: "png or jpeg", category: "About User", autocomplete: false, required: false, readonly: false, toAdd: true},

     // Credentials
    { name: "email", type: "string", label: "Email", placeholder: "example@domain.com" , category: "Credentials", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "password", type: "string", label: "Password", placeholder: "******", category: "Credentials", autocomplete: false, required: true, readonly: false, toAdd: true},

    // Access
    { name: "role", type: "string", label: "Role", placeholder: "Admin, default", category: "Access", autocomplete: true, required: true, readonly: false, toAdd: true},
];

// INVENTORY
export const InventoryItemsMetadata = [
    {name: "inventoryId", type: "string", label: "Inventory ID", placeholder: "", category: "Basic Info", autocomplete: false, required: true, readonly: true, toAdd: false},
    {name: "productId", type: "string", label: "Product", placeholder: "Product ID", category: "Product Info", autocomplete: true, required: true, readonly: false, toAdd: true},
    {name: "status", type: "number", label: "Status", placeholder: "Status", category: "Status", autocomplete: false, required: true, readonly: false, toAdd: false},
    {name: "quantity", type: "number", label: "Current Stock", placeholder: "Stock", category: "Stock Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "price", type: "number", label: "Current Price", placeholder: "Price", category: "Stock Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "reorderLevel", type: "number", label: "Reorder Level", placeholder: "Reorder Level", category: "Stock Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "loadPrice", type: "number", label: "Load Price", placeholder: "₹", category: "Pricing", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "unloadingPrice", type: "number", label: "Unloading Price", placeholder: "₹", category: "Pricing", autocomplete: false , required: true, readonly: false, toAdd: true},

    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
];

/* ------ */

export const LocationMetadata = [
    { name: "warehouseId", type: "string", label: "Location ID", placeholder: "Location ID", category: "Shipping", autocomplete: false, required: false, readonly: true, toAdd: false},
    { name: "warehouseName", type: "string", label: "Warehouse Name", placeholder: "", category: "Shipping", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "capacity", type: "number", label: "Capacity", placeholder: "(cm3)", category: "Shipping", autocomplete: false, required: true, readonly: false, toAdd: true},
    { name: "addressLine", type: "string", label: "Address", placeholder: "Plot no. & Other details", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "landmark", type: "string", label: "Landmark", placeholder: "Near anything recognisable?", category: "Shipping", autocomplete: false , required: false, readonly: false, toAdd: true},
    { name: "city", type: "string", label: "City", placeholder: "Patna, Delhi, etc.", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "district", type: "string", label: "District", placeholder: "Specify district or area", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},
    { name: "state", type: "string", label: "State", placeholder: "", category: "Shipping", autocomplete: true , required: true, readonly: false, toAdd: true},
    { name: "pinCode", type: "number", label: "Pin Code", placeholder: "xxxxxx", category: "Shipping", autocomplete: false , required: true, readonly: false, toAdd: true},

    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
]

export const BatchViewMetadata = [
    {name: "batchId", type: "string", label: "Batch ID", placeholder: "Batch ID", category: "Basic Info", autocomplete: false, required: true, readonly: true, toAdd: false},
    {name: "supplierId", type: "string", label: "Supplier", placeholder: "Supplier ID", category: "Supplier Info", autocomplete: true, required: true, readonly: false, toAdd: true},
    {name: "unitPrice", type: "number", label: "Unit Price", placeholder: "Unit Price", category: "Pricing Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "quantity", type: "number", label: "Quantity", placeholder: "Quantity", category: "Stock Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "batchNumber", type: "number", label: "Batch Number", placeholder: "xxxxxx", category: "Basic Info", autocomplete: false, required: true, readonly: true, toAdd: true},
    {name: "referenceNumber", type: "number", label: "Reference Number", placeholder: "xxxxxx", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "status", type: "number", label: "Status", placeholder: "Status", category: "Status", autocomplete: false, required: true, readonly: false, toAdd: false},
    {name: "entryDate", type: "date", label: "Entry Date", placeholder: "entry Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "exitDate", type: "date", label: "Exit Date", placeholder: "exit Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},

    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
]


export const WarehouseEntryMetadata = [
    {name: "warehouseId ", type: "string", label: "Batch ID", placeholder: "Batch ID", category: "Basic Info", autocomplete: false, required: true, readonly: true, toAdd: false},
    {name: "supplierId", type: "string", label: "Supplier", placeholder: "Supplier ID", category: "Supplier Info", autocomplete: true, required: true, readonly: false, toAdd: true},
    {name: "priceOrdered", type: "number", label: "Batch Price", placeholder: "₹", category: "Pricing Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "quantityOrdered", type: "number", label: "Quantity", placeholder: "", category: "Stock Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "batchNumber", type: "number", label: "Batch Number", placeholder: "xxxxxx", category: "Basic Info", autocomplete: false, required: true, readonly: true, toAdd: true},
    {name: "referenceNumber", type: "number", label: "Reference Number", placeholder: "xxxxxx", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "entryDate", type: "date", label: "Entry Date", placeholder: "entry Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "manufactureDate", type: "date", label: "Manufacture Date", placeholder: "Manufacture Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},
    {name: "expiryDate", type: "date", label: "Expiry Date", placeholder: "Expiry Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},
    // {name: "exitDate", type: "date", label: "Exit Date", placeholder: "exit Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},
    // {name: "orderDate", type: "date", label: "Order Date", placeholder: "Order Date", category: "Dates", autocomplete: false, required: true, readonly: false, toAdd: true},

    {name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false},
    {name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false},
]

 export const OrganizationMetadata = [
     { name: "organizationId", type: "number", label: "Organization ID", placeholder: "ID", category: "Basic Info", readonly: true, autocomplete: false },
     { name: "organizationName", type: "string", label: "Organization Name", placeholder: "Name", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "organizationType", type: "string", label: "Organization Type", placeholder: "Type", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "logo", type: "string", label: "Logo", placeholder: "Logo URL", category: "Basic Info", autocomplete: false, required: false, readonly: false, toAdd: true },
     { name: "industry", type: "string", label: "Industry", placeholder: "Industry", category: "Basic Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "phone", type: "string", label: "Phone", placeholder: "Phone Number", category: "Contact Info", autocomplete: false, required: false, readonly: false, toAdd: true },
     { name: "email", type: "string", label: "Email", placeholder: "example@domain.com", category: "Contact Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "website", type: "string", label: "Website", placeholder: "Website URL", category: "Contact Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "addressLine", type: "string", label: "Address Line", placeholder: "Address", category: "Address Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "landmark", type: "string", label: "Landmark", placeholder: "Landmark", category: "Address Info", autocomplete: false, required: false, readonly: false, toAdd: true },
     { name: "city", type: "string", label: "City", placeholder: "City", category: "Address Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "district", type: "string", label: "District", placeholder: "District", category: "Address Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "state", type: "string", label: "State", placeholder: "State", category: "Address Info", autocomplete: true, required: true, readonly: false, toAdd: true },
     { name: "pinCode", type: "string", label: "Pin Code", placeholder: "Pin Code", category: "Address Info", autocomplete: false, required: true, readonly: false, toAdd: true },
     { name: "dateFounded", type: "date", label: "Date Founded", placeholder: "Date", category: "Additional Info", autocomplete: false, required: false, readonly: false, toAdd: true },
     { name: "dateAdded", type: "date", label: "Date Added", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false },
     { name: "addedBy", type: "string", label: "Added By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false },
     { name: "lastEditedDate", type: "date", label: "Last Edited Date", placeholder: "Date", category: "Additional Info", readonly: true, autocomplete: false },
     { name: "lastEditedBy", type: "string", label: "Last Edited By", placeholder: "Name", category: "Additional Info", readonly: true, autocomplete: false },
 ];
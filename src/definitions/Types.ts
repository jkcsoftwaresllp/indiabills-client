// noinspection SpellCheckingInspection

import { ReactNode } from "react";

export interface Metadata {
  category: string;
  elements: ReactNode[];
}


export interface Audit {
  auditId?: string;
  userId: string;
  action: "add" | "update" | "delete" | "transfer" | "shop" | "delivered" | "cancelled" | "failed"
  target: string;
  objectOfInterest: string;
  avatar: string;
  addedBy: string;
  date: string;
  remarks?: string;
}

export interface Discount {
  itemId: string;
  discountPercent: number;
  offerName: string;
  offers: string;
}

export interface SessionPayload {
  id: string | number;
  avatar: string | null,
  name: string,
  role: "admin" | "operators" | "customer" | "delivery" | "reporter"
  token: string,
}

export interface Item {
  itemId?: number;
  itemName: string;
  description: string;
  category: string;
  manufacturer: string;

  dimensions: string;
  weight: number;

  unitMRP: number;
  purchasePrice: number;
  salePrice: number;
  reorderLevel: number;
  loadingPrice: number;
  unloadingPrice: number;

  marketer?: string;
  ongoingOffer: boolean;

  cgst: number;
  sgst: number;
  cess: number;

  upc: string;
  hsn: string;

  packSize: number;

  currentQuantity?: number;

  variants?: Array<{ key: string; values: string[] }>;

  dateAdded?: Date;
  addedBy?: string;
  lastEditedDate?: Date;
  lastEditedBy?: string;
}

export interface TransferRecord {
  transferId: string
  inventoryItemId: string;
  quantityTransfered: number;
  sourceWarehouse: string; //locationId
  destinationWarehouse: string; //locationId
  exitDate: Date;
  entryDate: Date;
  reason: string;
  status: "In Transit" | "Transfered";
}

export interface Warehouse {
  warehouseId: string;
  warehouseName: string;
  capacity: number;
  addressId: number;
  customerId: number;
  addressLine: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pinCode: number;

  dateAdded: Date;
  addedBy: string;
  lastEditedDate: Date;
  lastEditedBy: string;
}

export interface Transport {
  [key: string]: string | number | boolean | Date;
  transportId: string;
  transportName: string;
  businessName: string;
  vehicleName: string;
  email: string;
  mobileNumber: number;
  alternateMobileNumber: number;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pinCode: number;
  branchOffice: string;
  aadharNumber: number;
  panNumber: number;
  driverName: string;
  driverMobileNumber: number;
  driverAlternateNumber: number;
  status: string;
  dateAdded: string;
  addedBy: string;
  lastEditedDate: string;
  lastEditedBy: string;
}

export interface Location {
  locationId: string;
  locationName: string;
  capacity: number;
  addressId: number;
  customerId: number;
  addressLine: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pinCode: number;
  dateAdded: Date;
  addedBy: string;
  lastEditedDate: Date;
  lastEditedBy: string;
}

export interface Supplier {
  [key: string]: string | number | boolean | Date;
  supplierId: string;
  supplierName: string;
  businessName: string;
  mobileNumber: number;
  alternateMobileNumber: number;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: number;
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  virtualPaymentAddress: string;
  remarks: string;

  dateAdded: Date;
  addedBy: string;
  lastEditedDate: Date;
  lastEditedBy: string;
}

export interface Offer {
  [key: string]: string | number | boolean | Date | undefined;
  offerId: string;
  offerName: string;
  description?: string;
  startDate: string;
  endDate: string;
  productID: number;
  discount: number;
  discountType: "percentage" | "value";
  maximumDiscount?: number;
  maximumDiscountPercentage?: "percentage" | "value";
  minimumPurchase?: number;
  offerApplicabilityFrequency?: string;
  status?: string;
  dateAdded: string;
  addedBy: string;
  lastEditedDate: string;
  lastEditedBy: string;
}

export interface User {
  userId?: string;
  userName: string;
  role: "admin" | "operators" | "customer" | "delivery" | "reporter"
  mobile: string;
  email: string;
  password: string;
  avatar: string;
  status?: string;

  dateAdded?: Date;
  addedBy?: string;
  lastEditedDate?: Date;
  lastEd_keyitedBy?: string;
}

export interface subBatch {
  itemId: string;
  itemName: string;
  quantity: number;
  discount: number;
  discountType: "percentage" | "value";
  packSize: number;
  recordUnitPrice: string | number;
  manufactureDate: string;
  expiryDate: string;
}

export interface Batch {
  batchId: string;
  qualityPass: "poor" | "ok" | "good";
  supplierId: string;
  warehouseId: string;
  subBatches: subBatch[];
  entryDate: string;
  batchPrice: string | number;

  batchNumber: string;
  invoiceNumber: string;

  status?: 'in stock' | 'out of stock' | 'pending' | 'reserved' | 'damaged';
}

export interface StockIssue {
  itemName: string;
  faultyQuantity: number;
  reason: string;
  remarks: string;
}

export interface Customer {
  customerId?: string;
  userId?: string;

  password: string;
  avatar: string;

  customerName: string;
  businessName: string;
  email: string;
  gender: string;
  mobile: string;
  alternateMobileNumber: number;
  gstin: string;
  fssai: number;
  registrationNumber: number;
  aadharNumber: number;
  panNumber: number;
  otherDocuments: string;
  status: string;

  addressType: string; // like home, work, secondary warehouse etc.
  addressLine: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;

  dateAdded?: string;
  addedBy?: string;
  lastEditedDate?: string;
  lastEditedBy?: string;
}

export interface CustomerAddress {
  addressId: number;
  customerId: number;
  addressType: string; // like home, work, secondary warehouse etc.
  addressLine: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
}

export type Services = Item | Partial<Item> | Supplier | Transport | Offer | Customer | User | Invoice | Location | Batch | Organization;

export interface Field<T> {
  name: keyof T;
  type: string,
  label: string;
  placeholder: string;
  category: string;
  autocomplete: boolean;
  required?: boolean; // For AddForm
  toAdd?: boolean; // For AddForm
  readonly: boolean; // For UpdateForm
}

export interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: Date;
  
  orderId: string;
  dueDate: Date;

  paymentId: string;
  paymentDate?: Date;

  status?: string;

  dateAdded: Date;
  updatedAt: Date;
}

interface Variant {
  key: string,
  values: string[],
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  itemId: number;
  discount: number;
  unitMRP: number;
  purchasePrice: number;
  cess: number;
  cgst: number;
  sgst: number;
  salePrice: number;
  quantity: number;
  variants: Variant;
}

export interface Order {
  orderId: number;
  customerId: number;
  orderDate?: Date;
  invoiceDate?: Date;
  orderStatus?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "failed";
  totalAmount: number;
  
  shippingAddress: string; //same as billing address
  shippingCost: number;
  shippingDate: Date;

  discountOnOrder: number;

  placedByUserId: string;

  dateAdded: Date;
  updatedAt?: Date;
}

export interface OrderShow {
  orderId: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  avatar: string;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: string;
  totalAmount: string;
  taxAmount: string;
  discountApplied: string;
  shippingCost: string;
  shippingDate: string;
  placedByUserId: number;
  dateAdded: string;
  updatedAt: string;
  items: {
    orderItemId: number;
    orderId: number;
    itemId: number;
    unitPrice: string;
    quantity: number;
    variants: { [key: string]: any };
    itemName: string;
  }[];
  statusHistory: {
    status: string;
    updatedAt: string;
  }[];
}

export interface Organization {
  organizationId?: number;
  organizationName: string;
  about: string;
  tagline?: string;
  gstin: string;
  logo?: string;
  phone?: string;
  email: string;
  website: string;
  addressLine: string;
  state: string;

  upi: string;
  accountNumber: string;
  ifscCode: string;
  bankBranch: string;

  dateAdded?: Date;
  addedBy?: string;
  lastEditedDate?: Date;
  lastEditedBy?: string;
}

export interface Payment {
  paymentId: number;
  orderId: string;

  paymentStatus: "pending" | "done" | "cancelled" | "disputed";
  paymentMethod: "card" | "upi" | "cash" | "credit";
  paymentDate: Date;

  upi?: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  cardType?: string;
  bankName?: string;

  dateAdded: Date;
  updatedAt?: Date;
}

export interface Announcement {
  userId: string;
  title: string;
  message: string;
  location: string;
  expiry: Date;
}

export interface Note {
  userId: string;
  message: string;
  targetUser?: string;
  targetRole?: string;
  status: "received" | "read" | "posted";
}

export interface InvoiceInfo {
  /* invoice data */
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  
  /* order data */
  orderId: number;
  dueDate: string;
  orderDate: string;
  orderStatus?: string;
  shippingDate: string;
  placedByUserId: number;
  
  /* payment data */
  paymentId: number;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string;
  upi?: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate: string;
  cvv: string;
  cardType: string;
  bankName: string;
  
  /* customer data */
  customerId: number;
  customerName: string;
  customerAddress: string;
  shippingAddress: string;
  mobile: string;
  gstin?: string;
  
  /* items & calculation */
  discountOnOrder: string;
  shippingCost: string;
  items: {
    itemName: string;
    itemId: number;
    quantity: number;
    unitMRP: string;
    discount: string;
    purchasePrice: string;
    salePrice: string;
    hsn: string;
    cess: string;
    cgst: string;
    sgst: string;
  }[];
  declaration?: string;
  authorizedSignature?: string;
}

export interface CostCalculation {
  subtotal: number;
  totalTaxes: number;
  totalDiscountInValue: number;
  totalCost: number;
}

export interface OrderConfirm {
  orderData: Order;
  invoiceData: Invoice;
  paymentData: Payment;
  items: OrderItem[];
  newCustomer?: Partial<Customer> | null;
  newShippingAddress?: Partial<CustomerAddress> | null;
}

export interface Options { // general
  id: string | number | null;
  name: string;
}


export interface CustomerOptions {
  id: number;
  name: string;
  avatar?: string;
}

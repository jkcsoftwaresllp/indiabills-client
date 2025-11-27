import serverInstance from "./api-config";
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getWarehouseById } from './warehouseApi';
import { getTransportPartners, createTransportPartner, updateTransportPartner, deleteTransportPartner, getTransportPartnerById } from './transportApi';
import { getInventoryMovements, getInventoryMovementById, createInventoryMovement } from './inventoryMovementsApi';
import { getInventoryStock, getInventoryStockById, createInventoryStock } from './inventoryStockApi';
import { getReconciliations, getReconciliationById, createReconciliation, getReconciliationDetails, addReconciliationDetails, updateReconciliationStatus } from './reconciliationsApi';
import { getBatches, getBatchById, createBatch, updateBatch, deleteBatch, getBatchesByWarehouse, transferBatch } from './batchesApi';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerProfile, getCustomerProfileById } from './customersApi';
import { ownerSignup, createOrganization, getOrganization, updateOrganization, getOrganizationById } from './organizationApi';
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from './suppliersApi';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './productsApi';
import { getOffers, getOfferById, createOffer, updateOffer, deleteOffer } from './offersApi';
import { login, switchOrganization, logout, getUserOrganizations } from './authApi';
import { getUsers, getUserById, getUserByUsername, getUsersByRole, createUser, updateUser, deleteUser } from './userApi';
import { uploadUserImage } from './userApi';
// import { updateOrganizationById } from './organizationApi';
import { checkSession } from './authApi';
import { getAnnouncements, createAnnouncement, getShopAnnouncements, getChannelAnnouncements, getNotes, createNote } from './channelApi';
import { addToCart, removeFromCart, updateCartItem, getCart, checkoutCart } from './cartApi';
import { getPayments, getPaymentById, updatePaymentStatus, createPayment, getInvoice } from './paymentsApi';
import { toggleWishlist, getWishlist, clearWishlist } from './wishlistApi';
import { getSubscriptionPlans, getSubscriptionPlan, createSubscriptionOrder, verifySubscriptionPayment, getSubscriptionHistory } from './subscriptionApi';

async function getStuff(path) {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return [];
  }
}

async function updateStuff(path, data) {
  try {
    const response = await serverInstance.put(path, data);
    console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to update the data for ${path}:`, e.response);
    return 500;
  }
}

async function getReport(path, data) {
  try {
    const response = await serverInstance.post(path, data);
    return response.data;
  } catch (e) {
    console.error(`Failed to post the data for ${path}:`, e.response);
    return 500;
  }
}

export async function updateCredit(data) {
  try {
    const response = await serverInstance.put("reports/debit/update", data);
    return response;
  } catch (e) {
    console.error(`Failed to update credit`, e.response);
    return 500;
  }
}

export async function deleteCredit(id) {
  try {
    const response = await serverInstance.post("reports/debit/delete", { id });
    return response.data;
  } catch (e) {
    console.error(`Failed to update credit`, e.response);
    return 500;
  }
}

async function postData(path, data) {
  try {
    const response = await serverInstance.post(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to post the data for ${path}:`, e.response);
    return 500;
  }
}

async function deleteStuff(path, data) {
  try {
    const response = await serverInstance.delete(path, { data });
    console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to delete the data for ${path}:`, e.response);
    return 500;
  }
}

async function getData(path) {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return [];
  }
}

async function getRequest(path) {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return [];
  }
}

async function getRow(path) {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for ${path}:`, e.response);
    return {};
  }
}

async function deleteRow(path) {
  try {
    const response = await serverInstance.delete(path);
    console.log("Success:", response.data);
    return response.status;
  } catch (e) {
    console.error(`Failed to delete the data for ${path}:`, e.response);
    return 500;
  }
}

export async function getCount(path) {
  try {
    const response = await serverInstance.get(path);
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the data for /count:`, e.response);
    return 0;
  }
}

async function addRow(path, data) {
  try {
    const response = await serverInstance.post(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to add the data for ${path}:`, e.response);
    return e.response.status;
  }
}

async function quickAdd(path, data) {
  try {
    const response = await serverInstance.post(path, data);
    console.log("Success:", response.data);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (e) {
    console.error(`Failed to add the data for ${path}:`, e.response);
    return {
      status: 500,
      data: null,
    };
  }
}

async function updateRow(path, data) {
  try {
    const response = await serverInstance.post(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to update the data for ${path}:`, e.response);
    return 500;
  }
}

export async function updatePut(path, data) {
  try {
    const response = await serverInstance.put(path, data);
    return response.status;
  } catch (e) {
    console.error(`Failed to update the data for ${path}:`, e.response);
    return 500;
  }
}

async function checkSetup() {
  const response = await serverInstance.get("/auth/new");
  return response.data;
}

export async function getInvoiceCount() {
  const response = await serverInstance.get("/invoices/count");
  localStorage.setItem("invoiceCount", response.data);
  return;
}

/*--------LOGIN--------*/

async function apiLogin(payload) {
  try {
    return await serverInstance.post("/login", payload);
  } catch (e) {
    console.error(`Failed to login server:`, e.response);
    return e.response;
  }
}

async function uploadImg(image, root) {
  const formData = new FormData();
  formData.append("image", image);

  const PATH = root === true ? "/upload/org-logo" : "/users/upload/";

  // Fire-and-forget the request
  serverInstance
    .post(PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("Upload successful:", response.status);
    })
    .catch((error) => {
      console.error("Upload failed:", error.response);
    });

  return Promise.resolve(200);
}

async function fetchProduct(data) {
  try {
    return await serverInstance.post("/shop/place", data);
  } catch (e) {
    console.error("Failed to fetch products at shop", e.response);
  }
}

async function fetchDiscount(data) {
  try {
    return await serverInstance.post("/shop/discount/fetch", data);
  } catch (e) {
    console.error(e.response);
  }
}

async function placeOrder(data) {
  try {
    const response = await serverInstance.post("/shop/order/place", data);
    return { status: response.status, message: response.data };
  } catch (e) {
    return {
      status: e.response.status,
      message: e.response.data.reason.message,
    };
  }
}

async function fetchLogo() {
  try {
    const response = await serverInstance.get("/logo");
    return response.data;
  } catch (e) {
    console.error(`Failed to fetch the logo:`, e.response);
    return '';
  }
}

export {
  getData,
  getRequest,
  getReport,
  getStuff,
  deleteRow,
  addRow,
  updateRow,
  quickAdd,
  getRow,
  checkSetup,
  uploadImg,
  apiLogin,
  fetchProduct,
  fetchDiscount,
  placeOrder,
  fetchLogo,
  updateStuff,
  deleteStuff,
  postData,
  // Warehouse APIs
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseById,
  // Transport APIs
  getTransportPartners,
  createTransportPartner,
  updateTransportPartner,
  deleteTransportPartner,
  getTransportPartnerById,
  // Inventory Movement APIs
  getInventoryMovements,
  getInventoryMovementById,
  createInventoryMovement,
  // Inventory Stock APIs
  getInventoryStock,
  getInventoryStockById,
  createInventoryStock,
  // Reconciliation APIs
  getReconciliations,
  getReconciliationById,
  createReconciliation,
  getReconciliationDetails,
  addReconciliationDetails,
  updateReconciliationStatus,
  // Batch APIs
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchesByWarehouse,
  transferBatch,
  // Customer APIs
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerProfileById,
  // Organization APIs
  ownerSignup,
  createOrganization,
  getOrganization,
  updateOrganization,
  // Supplier APIs
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  // Product APIs
  getProducts,
  getProductById,
  getSuppliers,
  createProduct,
  updateProduct,
  deleteProduct,
  // Offer APIs
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  // Auth APIs
  login,
  switchOrganization,
  logout,
  getUserOrganizations,
  // User APIs
  getUsers,
  getUserById,
  getUserByUsername,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  // Session APIs
  checkSession,
  // Cart APIs
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  checkoutCart,
  // Payment APIs
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  createPayment,
  getInvoice,
   // Wishlist APIs
   toggleWishlist,
   getWishlist,
   clearWishlist,
   // Subscription APIs
   getSubscriptionPlans,
   getSubscriptionPlan,
   createSubscriptionOrder,
   verifySubscriptionPayment,
   getSubscriptionHistory,
   // Channel APIs
   getAnnouncements,
   createAnnouncement,
   getShopAnnouncements,
   getChannelAnnouncements,
   getNotes,
   createNote,
};

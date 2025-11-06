import { create } from 'zustand';

export const useStore = create((set) => ({
  session: { id: 0, name: '', role: 'none' },
  Popup: {
    message: 'Product added successfully',
    variant: 'success',
    active: false,
  },
  viewEntries: false,
  viewData: 'table',
  prefs: { viewData: 'table' },
  collapse: false,
  selectedProduct: null,
  showAudit: false,
  selectedProducts: {},
  Organization: { logo: '', name: '', fiscalStart: '', initials: '' },
  refreshTableId: null,
  fiscalStart: '',
  customerData: {
    orders: [],
    invoices: [],
    wishlist: [],
    profile: null
  },
  cart: {
    items: [],
    loading: false,
    error: null,
  },

  setFiscalStart: (date) => set(() => ({ fiscalStart: date })),
  setOrganization: (org) => set(() => ({ Organization: org })),
  openAudit: () => set(() => ({ showAudit: true })),
  closeAudit: () => set(() => ({ showAudit: false })),
  toggleViewEntries: () =>
    set((state) => ({ viewEntries: !state.viewEntries })),
  setCollapse: () => set((state) => ({ collapse: !state.collapse })),
  setPopup: (popup) => set(() => ({ Popup: popup })),
  successPopup: (message) =>
    set(() => ({
      Popup: { message: message, variant: 'success', active: true },
    })),
  errorPopup: (message) =>
    set(() => ({
      Popup: { message: message, variant: 'error', active: true },
    })),

  selectProduct: (product, variants) =>
    set((state) => {
      const newSelectedProducts = { ...state.selectedProducts };
      newSelectedProducts[product.itemId] = variants;
      return { selectedProducts: newSelectedProducts };
    }),

  deselectProduct: (productId) =>
    set((state) => {
      const newSelectedProducts = { ...state.selectedProducts };
      delete newSelectedProducts[productId];
      return { selectedProducts: newSelectedProducts };
    }),

  increaseProductCount: (productId) =>
    set((state) => {
      const newSelectedProducts = { ...state.selectedProducts };
      if (newSelectedProducts[productId]) {
        newSelectedProducts[productId].quantity =
          (newSelectedProducts[productId].quantity || 0) + 1;
      }
      return { selectedProducts: newSelectedProducts };
    }),

  decreaseProductCount: (productId) =>
    set((state) => {
      const newSelectedProducts = { ...state.selectedProducts };
      if (newSelectedProducts[productId]?.quantity > 1) {
        newSelectedProducts[productId].quantity -= 1;
      } else {
        delete newSelectedProducts[productId];
      }
      return { selectedProducts: newSelectedProducts };
    }),

  updateProductVariants: (itemId, updatedData) =>
    set((state) => {
      const updatedSelectedProducts = {
        ...state.selectedProducts,
        [itemId]: {
          ...state.selectedProducts[itemId],
          ...updatedData,
        },
      };
      return { selectedProducts: updatedSelectedProducts };
    }),

  clearSelectedProducts: () => set(() => ({ selectedProducts: {} })),

  removeSelectedProduct: (id) =>
    set((state) => {
      const updatedProducts = { ...state.selectedProducts };
      delete updatedProducts[id];
      return { selectedProducts: updatedProducts };
    }),

  refreshTableSetId: (id) => set(() => ({ refreshTableId: id })),

  // Customer data management
  updateCustomerOrders: (orders) => set((state) => ({
    customerData: { ...state.customerData, orders }
  })),
  
  updateCustomerInvoices: (invoices) => set((state) => ({
    customerData: { ...state.customerData, invoices }
  })),
  
  updateCustomerWishlist: (wishlist) => set((state) => ({
    customerData: { ...state.customerData, wishlist }
  })),
  
  updateCustomerProfile: (profile) => set((state) => ({
    customerData: { ...state.customerData, profile }
  })),

  // Cart management
  setCartLoading: (loading) => set((state) => ({
    cart: { ...state.cart, loading }
  })),

  setCartError: (error) => set((state) => ({
    cart: { ...state.cart, error, loading: false }
  })),

  setCartItems: (items) => set((state) => ({
    cart: { ...state.cart, items, loading: false, error: null }
  })),

  addCartItem: (item) => set((state) => {
    const existingItemIndex = state.cart.items.findIndex(cartItem => cartItem.product_id === item.product_id);
    if (existingItemIndex >= 0) {
      const updatedItems = [...state.cart.items];
      updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], ...item };
      return { cart: { ...state.cart, items: updatedItems } };
    } else {
      return { cart: { ...state.cart, items: [...state.cart.items, item] } };
    }
  }),

  updateCartItem: (productId, updates) => set((state) => {
    const updatedItems = state.cart.items.map(item =>
      item.product_id === productId ? { ...item, ...updates } : item
    );
    return { cart: { ...state.cart, items: updatedItems } };
  }),

  removeCartItem: (productId) => set((state) => {
    const updatedItems = state.cart.items.filter(item => item.product_id !== productId);
    return { cart: { ...state.cart, items: updatedItems } };
  }),

  clearCart: () => set((state) => ({
    cart: { ...state.cart, items: [], loading: false, error: null }
  })),
}));

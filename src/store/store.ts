import { create } from "zustand";
import { Item } from "../definitions/Types";

interface Popup {
    message: string,
    variant: "success" | "warning" | "error",
    active: boolean,
}

interface Org {
    logo: string,
    name: string,
    initials: string,
    fiscalStart: string,
}

interface Preferences {
    viewData: "card" | "table",
}

interface StoreState {
    Popup: Popup,
    prefs: Preferences,
    collapse: boolean,
    setCollapse: () => void,
    selectedProduct: Item | null,
    viewEntries: boolean,
    showAudit: boolean,
    setPopup: (popup: Popup) => void;
    successPopup: (message: string) => void;
    errorPopup: (message: string) => void;
    refreshTableId: number | null;
    Organization: Org;
    fiscalStart: string;

    setFiscalStart: (date: string) => void;
    setOrganization: (org: Org) => void;
    openAudit: () => void;
    closeAudit: () => void;
    toggleViewEntries: () => void;
    selectedProducts: Record<string, Record<string, string | number>>;
    selectProduct: (product: Item, variants: Record<string, string | number>) => void;
    deselectProduct: (productId: number) => void;
    increaseProductCount: (productId: number) => void;
    decreaseProductCount: (productId: number) => void;
    updateProductVariants: (productId: number, variants: Record<string, string | number>) => void;
    clearSelectedProducts: () => void;
    refreshTableSetId: (id: number) => void;
}

export const useStore = create<StoreState>((set) => ({
    session: { id: 0, name: "", role: "none" },
    Popup: { message: "Product added successfully", variant: "success", active: false },
    viewEntries: false,
    viewData: "table",
    prefs: { viewData: "table" },
    collapse: false,
    selectedProduct: null,
    showAudit: false,
    selectedProducts: {},
    Organization: { logo: "", name: "", fiscalStart: "", initials: "" },
    refreshTableId: null,
    fiscalStart: '',

    setFiscalStart: (date) => set(() => ({ fiscalStart: date })),
    setOrganization: (org) => set(() => ({ Organization: org })),
    openAudit: () => set(() => ({ showAudit: true })),
    closeAudit: () => set(() => ({ showAudit: false })),
    toggleViewEntries: () => set((state) => ({ viewEntries: !state.viewEntries })), //not defined in interface
    setCollapse: () => set((state) => ({ collapse: !state.collapse })), //not defined in interface
    setPopup: (popup: Popup) => set(() => ({ Popup: popup })),
    successPopup: (message: string) => set(() => ({ Popup: { message: message, variant: "success", active: true } })),
    errorPopup: (message: string) => set(() => ({ Popup: { message: message, variant: "error", active: true } })),

    selectProduct: (product, variants) => set((state) => {
        const newSelectedProducts = { ...state.selectedProducts };
        newSelectedProducts[product.itemId as number] = variants;
        return { selectedProducts: newSelectedProducts };
    }),

    deselectProduct: (productId) => set((state) => {
        const newSelectedProducts = { ...state.selectedProducts };
        delete newSelectedProducts[productId];
        return { selectedProducts: newSelectedProducts };
    }),

    increaseProductCount: (productId) => set((state) => {
        const newSelectedProducts = { ...state.selectedProducts };
        if (newSelectedProducts[productId]) {
            newSelectedProducts[productId].quantity = (newSelectedProducts[productId].quantity as number) + 1;
        }
        return { selectedProducts: newSelectedProducts };
    }),

    decreaseProductCount: (productId) => set((state) => {
        const newSelectedProducts = { ...state.selectedProducts };
        if (newSelectedProducts[productId].quantity > 1) {
            newSelectedProducts[productId].quantity = (newSelectedProducts[productId].quantity as number) - 1;
        } else {
            delete newSelectedProducts[productId];
        }
        return { selectedProducts: newSelectedProducts };
    }),

    updateProductVariants: (itemId: number, updatedData: any) =>
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
}));
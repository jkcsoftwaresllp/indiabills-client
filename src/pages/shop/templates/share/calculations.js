export const calculateTotalAmount = (products, selectedProducts) => {
  return products.reduce((totalAmount, product) => {
    const itemId = product.itemId;
    const quantity = selectedProducts[itemId]?.quantity || 0;
    const salePrice =
      selectedProducts[itemId]?.salePrice || product.salePrice || 0;
    return totalAmount + salePrice * quantity;
  }, 0);
};

export const calculateTaxes = (products, selectedProducts) => {
  return products.reduce((totalTaxes, product) => {
    const itemId = product.itemId;
    const cgst = Number(product.cgst) || 0;
    const sgst = Number(product.sgst) || 0;
    const cess = Number(product.cess) || 0;
    const gstRate = cgst + sgst + cess;

    const quantity = selectedProducts[itemId]?.quantity || 0;
    const salePrice =
      selectedProducts[itemId]?.salePrice || product.salePrice || 0;
    const taxPerItem = (gstRate * salePrice) / 100;

    return totalTaxes + taxPerItem * quantity;
  }, 0);
};

export const calculateSubtotal = (totalAmount, totalTaxes) => {
  return totalAmount - totalTaxes;
};

export const calculateDiscount = (
  products,
  selectedProducts,
  discountType,
  manualDiscount,
  activeDiscounts
) => {
  if (discountType === "manual") {
    return manualDiscount.manualDiscount || 0;
  }

  if (discountType === "automatic") {
    return products.reduce((total, product) => {
      const itemId = Number(product.itemId);
      const quantity = selectedProducts[itemId]?.quantity || 0;
      const salePrice =
        selectedProducts[itemId]?.salePrice || product.salePrice || 0;

      if (product.discountValue && product.offerName) {
        // Check if discount is active for this item
        if (activeDiscounts[itemId] === false) {
          return total; // Skip this discount
        }

        if (product.discountType === "percentage") {
          return (
            total +
            ((salePrice * product.discountValue) / 100) * quantity
          );
        } else if (product.discountType === "value") {
          return total + product.discountValue * quantity;
        }
      }

      return total;
    }, 0);
  }

  return 0;
};
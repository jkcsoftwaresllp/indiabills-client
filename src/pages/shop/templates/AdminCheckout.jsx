import { useEffect, useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import PageAnimate from "../../../components/Animate/PageAnimate";
import { useStore } from "../../../store/store";
import {
  fetchProduct,
  getData,
  getStuff,
  placeOrder,
  getRequest,
} from "../../../network/api";
import OrderCard from "../../../components/shop/OrderCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ComprehensiveInvoiceTemplate from "../../invoices/templates/Comprehensive"; // Adjust the path as necessary
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import {
  calculateSubtotal,
  calculateTaxes,
  calculateDiscount,
  calculateTotalAmount,
} from "./share/calculations";
import { CustomerSection, OrderDetails } from "./share/ShopSections";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import MouseHoverPopover from "../../../components/core/Explain";
import ShortInvoiceTemplate from "../../invoices/templates/Short";

const AdminCheckout = () => {
  const { errorPopup, successPopup, selectedProducts, clearSelectedProducts } =
    useStore();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState({});
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getRequest(`/organization`);
        setOrganization(data);
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    };

    fetchOrganization();
  }, []);

  const TemplateType = localStorage.getItem("invoiceTemplate") || "short";
  const invo = (Number(localStorage.getItem("invoiceCount") || "0000") + 1)
    .toString()
    .padStart(4, "0");

  const [initials, setInitials] = useState("");
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: invo,
    invoiceDate: new Date(),
    dueDate: new Date(),
  });

  const [payment, setPayment] = useState({
    paymentMethod: "cash",
    upi: "",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    cardType: "",
    bankName: "",
    paymentStatus: "done",
  });

  const [orderData, setOrderData] = useState({
    orderDate: new Date(),
    orderStatus: "pending",
    totalAmount: 0,
    taxAmount: 0,
    discountApplied: 0,
    shippingCost: 0,
    shippingAddress: "",
    shippingDate: new Date(),
    customerId: "0",
  });

  const [products, setProducts] = useState([]);
  const [discountType, setDiscountType] = useState("automatic");
  const [manualDiscount, setManualDiscount] = useState(0);
  const [activeDiscounts, setActiveDiscounts] = useState({});

  const [paymentMethod, setPaymentMethod] = useState("");
  const [payOffline, setPayOffline] = useState(false);
  const [payMethods, setPayMethods] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [ship, setShip] = useState(false);

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    customerName: "",
    businessName: "",
    email: "",
    gender: "",
    mobile: "",
    gstin: "",
  });

  const [newShipping, setNewShipping] = useState({
    addressLine: "",
    city: "",
    landmark: "",
    state: "",
    pinCode: "",
  });

  const [shippings, setShippings] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);

  const fetchShipping = async (customerId) => {
    const data = await getData(`/shop/shipping/${customerId}`);
    setShippings(data);
  };

  const fetchCustomers = async () => {
    const data = await getStuff("/customers/options");
    setCustomers(data);
  };

  useEffect(() => {
    const fetchFormDetails = async () => {
      const data = await getData("/settings/payment/methods");
      const ini = await getData("/settings/initials");
      setInitials(ini);
      setPayMethods(data);
    };
    fetchFormDetails();
  }, []);

  useEffect(() => {
    const IDs = Object.keys(selectedProducts);

    if (IDs.length <= 0) return;

    const fetchProductsAndCustomers = async () => {
      try {
        const res = await fetchProduct(IDs);
        if (res.status !== 200) {
          errorPopup("Server Error, Couldn't fetch products :(");
          return;
        }
        setProducts(res.data);

        await fetchCustomers();
      } catch (error) {
        errorPopup("Couldn't fetch product information :(.");
      }
    };

    if (Object.keys(selectedProducts).length > 0) {
      fetchProductsAndCustomers();
    } else {
      setProducts([]);
    }
  }, [selectedProducts, errorPopup]);

  useEffect(() => {
    if (selectedCustomer) {
      setOrderData((prev) => ({
        ...prev,
        customerId: String(selectedCustomer.id),
      }));
    }
  }, [selectedCustomer]);

  useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      totalAmount: totalCost,
      taxAmount: taxes,
      discountApplied: discountValue,
    }));
  }, [subtotal, taxes, discountValue, totalCost]);

  useEffect(() => {
    const newaddress = () =>
      `${selectedShipping?.addressLine}, ${selectedShipping?.city}, ${selectedShipping?.state}, ${selectedShipping?.pinCode}`;

    setOrderData((prev) => ({
      ...prev,
      shippingAddress: isNewCustomer
        ? newShipping.addressLine || ""
        : newaddress(),
    }));
  }, [selectedShipping, newShipping, isNewCustomer]);

  useEffect(() => {
    if (selectedCustomer !== null) {
      fetchShipping(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const filterKeys = new Set(Object.keys(selectedProducts).map(Number));
    const filteredArray = products.filter((product) =>
      filterKeys.has(Number(product.itemId)),
    );
    setProducts(filteredArray);
  }, [selectedProducts]);

  useEffect(() => {
    if (products.length > 0) {
      const initialDiscounts = {};
      products.forEach((product) => {
        if (product.discountValue && product.offerName) {
          initialDiscounts[product.itemId] = true;
        }
      });
      setActiveDiscounts(initialDiscounts);
    }
  }, [products]);

  useEffect(() => {
    const newTotalAmount = calculateTotalAmount(products, selectedProducts);
    const newTaxes = calculateTaxes(products, selectedProducts);
    const newSubtotal = calculateSubtotal(newTotalAmount, newTaxes);
    const newDiscountValue = calculateDiscount(
      products,
      selectedProducts,
      discountType,
      manualDiscount,
      activeDiscounts,
    );
    const newTotalCost =
      newTotalAmount - newDiscountValue + Number(orderData.shippingCost);

    const totalPurchasePrice = products.reduce((total, product) => {
      const quantity = selectedProducts[product.itemId]?.quantity || 0;
      const purchasePrice = Number(product.purchasePrice) || 0;
      return total + purchasePrice * quantity;
    }, 0);

    const newProfitOrLoss = newTotalCost - totalPurchasePrice;

    setTaxes(newTaxes);
    setSubtotal(newSubtotal);
    setDiscountValue(newDiscountValue);
    setTotalCost(newTotalAmount);
    setProfitOrLoss(newProfitOrLoss);
  }, [
    products,
    selectedProducts,
    discountType,
    manualDiscount,
    activeDiscounts,
    orderData.shippingCost,
  ]);

  const warnings = () => {
    if (isNewCustomer) {
      if (
        !newCustomer.customerName ||
        !newCustomer.mobile ||
        !newCustomer.email ||
        !newShipping.addressLine ||
        !newShipping.city ||
        !newShipping.state ||
        !newShipping.pinCode
      ) {
        errorPopup("Please fill all the fields!");
        return true;
      }
    } else {
      if (!selectedCustomer || !selectedShipping || !orderData.shippingDate) {
        errorPopup("Please select a customer!");
        return true;
      } else if (!payOffline && !paymentMethod) {
        errorPopup("Please select a payment method!");
        return true;
      }
    }
  };

  const collectFinalData = async () => {
    const apiData = {
      newCustomer: isNewCustomer ? { ...newCustomer, ...newShipping } : null,
      invoice: invoiceData,
      orderData: { ...orderData, orderStatus: ship ? "shipped" : "pending" },
      orderItems: products.map((product) => {
        const selectedProduct = selectedProducts[product.itemId];
        return {
          itemName: product.itemName,
          itemId: Number(product.itemId),
          variants: selectedProduct.variants,
          unitMRP: product.unitMRP,
          quantity: selectedProduct.quantity,
          discount:
            discountType === "manual"
              ? "0"
              : product.discountValue?.toString() || "0",
          purchasePrice: product.purchasePrice.toString(),
          salePrice:
            selectedProduct.salePrice === undefined
              ? product.salePrice
              : selectedProduct.salePrice.toString(),
          cess: product.cess?.toString() || "0",
          cgst: product.cgst?.toString() || "0",
          sgst: product.sgst?.toString() || "0",
        };
      }),
      payment: {
        ...payment,
        paymentDate: new Date(),
        ...(payment.paymentMethod === "upi" &&
          !payment.upi && { upi: undefined }),
        ...(payment.paymentMethod === "card" &&
          !payment.cardNumber && {
            cardNumber: undefined,
            cardHolderName: undefined,
            expiryDate: undefined,
            cvv: undefined,
            cardType: undefined,
            bankName: undefined,
          }),
      },
    };

    const response = await placeOrder(apiData);

    if (response.status !== 201) {
      errorPopup(`${response.message}`);
      return;
    }

    successPopup("Order placed successfully!");
    clearSelectedProducts();
    navigate("/orders");
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const invoiceReport = {
    invoiceId: 1,
    invoiceNumber: invoiceData.invoiceNumber,
    invoiceDate: new Date(invoiceData.invoiceDate).toISOString(),
    dueDate: invoiceData.dueDate.toISOString(),
    orderId: 1,
    orderDate: orderData.orderDate
      ? orderData.orderDate.toISOString()
      : new Date().toISOString(),
    orderStatus: orderData.orderStatus,
    paymentId: 1,
    paymentDate: payment.paymentDate
      ? payment.paymentDate.toISOString()
      : new Date().toISOString(),
    paymentStatus: payment.paymentStatus,
    paymentMethod: payment.paymentMethod,
    upi: payment.upi,
    cardNumber: payment.cardNumber,
    cardHolderName: payment.cardHolderName,
    expiryDate: payment.expiryDate || "",
    cvv: payment.cvv || "",
    cardType: payment.cardType || "",
    bankName: payment.bankName || "",
    customerId: Number(orderData.customerId),
    customerName: isNewCustomer
      ? newCustomer.customerName || ""
      : selectedCustomer?.name || "",
    customerAddress: isNewCustomer
      ? `${newShipping.addressLine}, ${newShipping.city}, ${newShipping.state}, ${newShipping.pinCode}`
      : orderData.shippingAddress || "",
    mobile: isNewCustomer ? newCustomer.mobile || "" : "",
    gstin: isNewCustomer ? newCustomer.gstin || "" : "",
    shippingAddress: orderData.shippingAddress,
    totalAmount: totalCost.toFixed(2),
    taxAmount: taxes.toFixed(2),
    discountApplied: Number(discountValue).toFixed(2),
    shippingDate: new Date(orderData.shippingDate).toISOString(),
    placedByUserId: 0,
    shippingCost: orderData.shippingCost.toFixed(2),
    items: products.map((product) => {
      const selectedProduct = selectedProducts[product.itemId];
      if (!selectedProduct) {
        console.warn(
          `Product with ID ${product.itemId} is missing from selectedProducts.`,
        );
        return null;
      }
      return {
        itemName: product.itemName,
        itemId: Number(product.itemId),
        quantity: selectedProduct.quantity,
        unitMRP: product.unitMRP,
        discount: product.discountValue,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        hsn: product.hsn || "",
        cess: product.cess || "0",
        cgst: product.cgst || "0",
        sgst: product.sgst || "0",
      };
    }),
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePayClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setSelectedPaymentMethod(method);
    setPayment((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  return (
    <PageAnimate nostyle>
      <main className="p-6 w-full flex flex-col gap-8 bg-white rounded-xl">
        <section className="p-4 w-full flex items-center justify-between">
          <button className={""} onClick={() => navigate("/shop")}>
            <ArrowBackIosNewIcon />
            Back to Shop
          </button>
          <div className={"flex gap-2 items-center"}>
            <div>
              <MouseHoverPopover
                triggerElement={
                  <Button
                    variant={"outlined"}
                    color="primary"
                    onClick={handleOpen}
                  >
                    <ReceiptIcon />
                  </Button>
                }
                popoverContent={<span className="text-xs"> View Invoice </span>}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="invoice-modal-title"
                aria-describedby="invoice-modal-description"
              >
                <section id="invoice">
                  {TemplateType === "short" ? (
                    <ShortInvoiceTemplate
                      invoice={invoiceReport}
                      Organization={organization}
                    />
                  ) : (
                    <ComprehensiveInvoiceTemplate
                      invoice={invoiceReport}
                      organization={organization}
                    />
                  )}
                </section>
              </Modal>
            </div>
            <button
              onClick={handlePayClick}
              className="p-2 min-w-32 bg-primary text-slate-200 rounded-md"
            >
              <PaymentIcon /> Pay
            </button>
            <div
              className="flex items-center gap-2"
              onClick={() => setShip(!ship)}
            >
              Instant Ship?
              <span class={"text-rose-500 font-medium"}>
                {ship ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </section>

        {Object.keys(selectedProducts).length > 0 ? (
          <section
            id="selected-products"
            className="flex overflow-x-scroll gap-2 text-slate-500 p-4"
          >
            <OrderCard products={products} />
          </section>
        ) : (
          <h1 className="text-slate-500 p-4 idms-control">
            {" "}
            Nothing to show :p{" "}
          </h1>
        )}

        <CustomerSection
          isNewCustomer={isNewCustomer}
          setIsNewCustomer={setIsNewCustomer}
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          newShipping={newShipping}
          setNewShipping={setNewShipping}
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          shippings={shippings}
          discountType={discountType}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
          setOrderData={setOrderData}
          setDiscountType={setDiscountType}
          activeDiscounts={activeDiscounts}
          setActiveDiscounts={setActiveDiscounts}
          products={products}
          manualDiscount={manualDiscount}
          setManualDiscount={setManualDiscount}
          initials={initials}
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
        />

        <OrderDetails
          subtotal={subtotal}
          taxes={taxes}
          discountValue={discountValue}
          totalCost={totalCost}
          profitOrLoss={profitOrLoss}
          orderData={orderData}
          payMethods={payMethods}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          payOffline={payOffline}
          setPayOffline={setPayOffline}
          selectedCustomer={selectedCustomer}
          selectedShipping={selectedShipping}
          newCustomer={newCustomer}
          newShipping={newShipping}
          payment={payment}
          setPayment={setPayment}
        />

        <Modal
          open={isPaymentModalOpen}
          onClose={handlePaymentModalClose}
          aria-labelledby="payment-method-modal-title"
          aria-describedby="payment-method-modal-description"
        >
          <div className="flex justify-center items-center h-full">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h2 id="payment-method-modal-title" className="text-xl mb-4">
                Select Payment Method
              </h2>
              <FormControl fullWidth className="mb-4">
                <InputLabel id="payment-method-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="payment-method-select"
                  value={selectedPaymentMethod}
                  label="Payment Method"
                  onChange={handlePaymentMethodChange}
                >
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                </Select>
              </FormControl>

              {selectedPaymentMethod === "upi" && (
                <TextField
                  label="UPI ID"
                  variant="outlined"
                  fullWidth
                  className="mb-4"
                  value={payment.upi}
                  onChange={(e) =>
                    setPayment({ ...payment, upi: e.target.value })
                  }
                />
              )}

              {selectedPaymentMethod === "card" && (
                <>
                  <TextField
                    label="Card Number"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment({ ...payment, cardNumber: e.target.value })
                    }
                  />
                  <TextField
                    label="Card Holder Name"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={payment.cardHolderName}
                    onChange={(e) =>
                      setPayment({ ...payment, cardHolderName: e.target.value })
                    }
                  />
                  <TextField
                    label="Expiry Date"
                    variant="outlined"
                    type="date"
                    fullWidth
                    className="mb-4"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={payment.expiryDate}
                    onChange={(e) =>
                      setPayment({ ...payment, expiryDate: e.target.value })
                    }
                  />
                  <TextField
                    label="CVV"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    type="password"
                    value={payment.cvv}
                    onChange={(e) =>
                      setPayment({ ...payment, cvv: e.target.value })
                    }
                  />
                  <TextField
                    label="Card Type"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={payment.cardType}
                    onChange={(e) =>
                      setPayment({ ...payment, cardType: e.target.value })
                    }
                  />
                  <TextField
                    label="Bank Name"
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                    value={payment.bankName}
                    onChange={(e) =>
                      setPayment({ ...payment, bankName: e.target.value })
                    }
                  />
                </>
              )}

              {(selectedPaymentMethod === "cash" ||
                selectedPaymentMethod === "credit") && (
                <Typography variant="body1" className="mb-4">
                  No additional information required for{" "}
                  {selectedPaymentMethod.charAt(0).toUpperCase() +
                    selectedPaymentMethod.slice(1)}{" "}
                  payments.
                </Typography>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  onClick={handlePaymentModalClose}
                  color="secondary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    let hasWarnings = false;

                    if (selectedPaymentMethod === "upi" && !payment.upi) {
                      errorPopup(
                        "You selected UPI but didn't provide a UPI ID.",
                      );
                      hasWarnings = true;
                    }

                    if (selectedPaymentMethod === "card") {
                      const {
                        cardNumber,
                        cardHolderName,
                        expiryDate,
                        cvv,
                        cardType,
                        bankName,
                      } = payment;
                      if (
                        !cardNumber ||
                        !cardHolderName ||
                        !expiryDate ||
                        !cvv ||
                        !cardType ||
                        !bankName
                      ) {
                        errorPopup(
                          "You selected Card but didn't provide all card details.",
                        );
                        hasWarnings = true;
                      }
                    }

                    setIsPaymentModalOpen(false);
                    collectFinalData();
                  }}
                  color="primary"
                  variant="contained"
                >
                  Confirm & Pay
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </main>
    </PageAnimate>
  );
};

export default AdminCheckout;

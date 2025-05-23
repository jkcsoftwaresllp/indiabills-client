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
import {
  Item,
  Services,
  CustomerAddress,
  Customer,
  Invoice,
  OrderItem,
  Order,
  Payment,
  InvoiceInfo,
} from "../../../definitions/Types";
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

interface CustomerOption {
  id: string | number | null;
  name: string;
}

interface ActiveDiscounts {
  [key: number]: boolean;
}

const AdminCheckout = () => {
  const { errorPopup, successPopup, selectedProducts, clearSelectedProducts } =
    useStore();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState<Organization>(
    {} as Organization,
  );
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getRequest(`/organization`);
        setOrganization(data);
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    };

    fetchOrganization().then();
  }, []);

  const TemplateType = localStorage.getItem("invoiceTemplate") || "short";
  const invo = (Number(localStorage.getItem("invoiceCount") || "0000") + 1)
    .toString()
    .padStart(4, "0");

  // console.log("invo",invo);

  const [initials, setInitials] = useState<string>("");
  const [invoiceData, setInvoiceData] = useState<Invoice>({
    invoiceNumber: invo,
    invoiceDate: new Date(),
    dueDate: new Date(),
  });

  const [payment, setPayment] = useState<Payment>({
    paymentMethod: "cash",

    upi: "",

    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "", //000
    cardType: "",
    bankName: "",

    paymentStatus: "done", // doing 'done' for now, might consider changing it to 'pending' for tracking the credit order (not imp)
  });

  const [orderData, setOrderData] = useState<Order>({
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

  const [products, setProducts] = useState<Item[]>([]);
  const [discountType, setDiscountType] = useState<string>("automatic");
  const [manualDiscount, setManualDiscount] = useState<number>(0);
  const [activeDiscounts, setActiveDiscounts] = useState<ActiveDiscounts>({});

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [payOffline, setPayOffline] = useState<boolean>(false);
  const [payMethods, setPayMethods] = useState<string[]>([]);

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);

  const [ship, setShip] = useState<boolean>(false);

  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    customerName: "",
    businessName: "",
    email: "",
    gender: "",
    mobile: "",
    gstin: "",
  });

  const [newShipping, setNewShipping] = useState<Partial<CustomerAddress>>({
    addressLine: "",
    city: "",
    landmark: "",
    state: "",
    pinCode: "",
  });

  const [shippings, setShippings] = useState<CustomerAddress[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<CustomerAddress | null>(null);

  const [subtotal, setSubtotal] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [profitOrLoss, setProfitOrLoss] = useState<number>(0);

  const fetchShipping = async (customerId: string | number | null) => {
    const data: Services[] = await getData(`/shop/shipping/${customerId}`);
    setShippings(data as unknown as CustomerAddress[]);
  };

  const fetchCustomers = async () => {
    const data = await getStuff("/customers/options");
    setCustomers(data as CustomerOption[]);
  };

  useEffect(() => {
    const fetchFormDetails = async () => {
      const data = await getData("/settings/payment/methods");
      const ini = await getData("/settings/initials");
      setInitials(ini as unknown as string);
      setPayMethods(data as string[]);
    };
    fetchFormDetails().then();
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

        await fetchCustomers(); // Fetch customers after products
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
      const initialDiscounts: ActiveDiscounts = {};
      products.forEach((product) => {
        if (product.discountValue && product.offerName) {
          initialDiscounts[product.itemId] = true; // Set to true by default
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

    // Calculate profit or loss
    const newProfitOrLoss = newTotalCost - totalPurchasePrice;

    setTaxes(newTaxes);
    setSubtotal(newSubtotal);
    setDiscountValue(newDiscountValue);
    setTotalCost(newTotalAmount);
    setProfitOrLoss(newProfitOrLoss);
  }, [
    products,
    selectedProducts, // Ensure selectedProducts is included in dependencies
    discountType,
    manualDiscount,
    activeDiscounts,
    orderData.shippingCost,
  ]);

  useEffect(() => {
    const filterKeys = new Set(Object.keys(selectedProducts).map(Number));
    const filteredArray = products.filter((product) =>
      filterKeys.has(Number(product.itemId)),
    );
    setProducts(filteredArray);
  }, [selectedProducts]);

  const warnings = () => {
    // console.log("new customer?:", isNewCustomer);

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
        // console.log("newcustomer: ", newShipping);
        // console.log("newcustomer: ",{ ...newCustomer, ...newShipping });
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
    // const war = warnings();
    // if (war) return;
    interface FinalData {
      orderData: Order;
      orderItems: OrderItem[];
      invoice: Invoice;
      newCustomer?: unknown;
      payment: Payment;
    }

    const apiData: FinalData = {
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
              : selectedProduct.salePrice.toString(), // Use updated salePrice
          cess: product.cess?.toString() || "0",
          cgst: product.cgst?.toString() || "0",
          sgst: product.sgst?.toString() || "0",
        };
      }),
      payment: {
        ...payment,
        paymentDate: new Date(),
        // Optionally remove empty fields
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

    console.log(apiData);
    // return ;

    const response = await placeOrder(apiData);

    if (response.status !== 201) {
      // console.log(response.message)
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

  const invoiceReport: InvoiceInfo = {
    invoiceId: 1,
    invoiceNumber: invoiceData.invoiceNumber,
    invoiceDate: new Date(invoiceData.invoiceDate).toISOString(),
    dueDate: invoiceData.dueDate.toISOString(),

    /* order data */
    orderId: 1,
    orderDate: orderData.orderDate
      ? orderData.orderDate.toISOString()
      : new Date().toISOString(),
    orderStatus: orderData.orderStatus,

    /* payment data */
    paymentId: 1, // Replace with actual payment ID if available
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

    /* customer */
    customerId: Number(orderData.customerId),
    customerName: isNewCustomer
      ? newCustomer.customerName || ""
      : selectedCustomer?.name || "",
    customerAddress: isNewCustomer
      ? `${newShipping.addressLine}, ${newShipping.city}, ${newShipping.state}, ${newShipping.pinCode}`
      : orderData.shippingAddress || "",
    mobile: isNewCustomer ? newCustomer.mobile || "" : "", // Add logic to get mobile if existing customer
    gstin: isNewCustomer ? newCustomer.gstin || "" : "", // Add logic to get GSTIN if existing customer

    shippingAddress: orderData.shippingAddress,
    totalAmount: totalCost.toFixed(2),
    taxAmount: taxes.toFixed(2),
    discountApplied: Number(discountValue).toFixed(2),
    shippingDate: new Date(orderData.shippingDate).toISOString(),
    placedByUserId: 0, // Replace with actual user ID if available

    /* items & calculation */
    shippingCost: orderData.shippingCost.toFixed(2),
    items: products.map((product) => {
      const selectedProduct = selectedProducts[product.itemId];
      if (!selectedProduct) {
        // Optionally, you can log or handle this case
        console.warn(
          `Product with ID ${product.itemId} is missing from selectedProducts.`,
        );
        return null; // This will be filtered out in the next step
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

  // Payment Method Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Handle Payment Button Click
  const handlePayClick = () => {
    setIsPaymentModalOpen(true);
  };

  // Handle Modal Close
  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  // Handle Payment Method Selection
  const handlePaymentMethodChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const method = event.target.value as string;
    setSelectedPaymentMethod(method);
    setPayment((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // Selected Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

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

        {/* ITEMS SECTION */}
        {Object.keys(selectedProducts).length > 0 ? (
          <section
            id="selected-products"
            className="flex overflow-x-scroll gap-2 text-slate-500 p-4"
          >
            <OrderCard products={products} />
            {/* {products.map((product) => (
                    <div key={product.itemId} className="flex gap-4">
                    </div>
                ))} */}
          </section>
        ) : (
          <h1 className="text-slate-500 p-4 idms-control">
            {" "}
            Nothing to show :p{" "}
          </h1>
        )}

        {/* CUSTOMER AND SHIPPING SECTION */}
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

        {/* PRICING AND DISCOUNT SECTION */}
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

        {/* Payment Method Selection Modal */}
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

              {/* Conditional Rendering of Fields Based on Payment Method */}
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

              {/* No additional fields for Cash and Credit */}
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

                    // Check for UPI without details
                    if (selectedPaymentMethod === "upi" && !payment.upi) {
                      errorPopup(
                        "You selected UPI but didn't provide a UPI ID.",
                      );
                      hasWarnings = true;
                    }

                    // Check for Card without details
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

                    // Proceed regardless of warnings
                    setIsPaymentModalOpen(false);
                    collectFinalData();
                  }}
                  color="primary"
                  variant="contained"
                  // disabled={
                  //   (selectedPaymentMethod === "upi" && !payment.upi) ||
                  //   (selectedPaymentMethod === "card" &&
                  //     (!payment.cardNumber ||
                  //       !payment.cardHolderName ||
                  //       !payment.expiryDate ||
                  //       !payment.cvv ||
                  //       !payment.cardType ||
                  //       !payment.bankName))
                  // }
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

import React, { useEffect, useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MouseHoverPopover from "../../components/core/Explain";
import { Button, Modal } from "@mui/material";
import ComprehensiveInvoiceTemplate from "../invoices/templates/Comprehensive";
import { useNavigate, useParams } from "react-router-dom";
import PageAnimate from "../../components/Animate/PageAnimate";
import {
  getData,
  getRequest,
  getRow,
  getStuff,
  updatePut,
} from "../../network/api";
import ItemsEditTable from "../../components/FormComponent/ItemsEditTab";
import {
  Avatar,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { getBaseURL } from "../../network/api/api-config";
import SpinnerFullPage from "../more/spinner";
import styles from "./styles/InspectOrder.module.css"; 

const InspectOrder = () => {
  const [openInvoice, setOpenInvoice] = useState(false);
  const [initials, setInitials] = useState("");
  const [organization, setOrganization] = useState({});

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const data = await getRequest(`/organization`);
        setOrganization(data);
        const ini = await getData("/settings/initials");
        setInitials(ini);
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    };

    fetchOrganization();
  }, []);

  const handleOpenInvoice = () => setOpenInvoice(true);
  const handleCloseInvoice = () => setOpenInvoice(false);

  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [formState, setFormState] = useState({
    customerId: "",
    orderDate: "",
    shippingAddress: "",
    shippingCost: "",
    shippingDate: "",
    discountOnOrder: "",
    orderStatus: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    paymentStatus: "",
    paymentMethod: "",
    paymentDate: "",
    items: [],
  });

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRow(`orders/${orderId}`);
      setOrderData(response);
      setFormState({
        customerId: response.customerId || "",
        orderDate: response.orderDate || "",
        shippingAddress: response.shippingAddress || "",
        shippingCost: response.shippingCost || "",
        shippingDate: response.shippingDate || "",
        discountOnOrder: response.discountOnOrder || "",
        orderStatus: response.orderStatus || "",
        invoiceNumber: response.invoiceNumber || "",
        invoiceDate: response.invoiceDate || "",
        dueDate: response.dueDate || "",
        paymentStatus: response.paymentStatus || "",
        paymentMethod: response.paymentMethod || "",
        paymentDate: response.paymentDate || "",
        items:
          response.items.map((item) => ({
            ...item,
            id: generateUniqueId(),
          })) || [],
      });
    };
    fetchData();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleItemChange = (id, e) => {
    const { name, value } = e.target;
    const selectedItem = products.find((item) => item.id === Number(value));

    if (name === "itemId" && selectedItem) {
      setFormState((prevState) => ({
        ...prevState,
        items: prevState.items.map((item) =>
          item.id === id
            ? {
                ...item,
                itemId: selectedItem.id,
                itemName: selectedItem.name,
                unitMRP: selectedItem.unitMRP,
                hsn: selectedItem.hsn,
                purchasePrice: selectedItem.purchaseRate,
                salePrice: selectedItem.price,
                cess: selectedItem.cess,
                sgst: selectedItem.sgst,
                cgst: selectedItem.cgst,
              }
            : item
        ),
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        items: prevState.items.map((item) =>
          item.id === id ? { ...item, [name]: value } : item
        ),
      }));
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: generateUniqueId(),
      itemName: "",
      hsn: "",
      unitMRP: 0,
      quantity: 1,
      discount: 0,
      purchasePrice: "",
      salePrice: "",
      cess: 0,
      sgst: 0,
      cgst: 0,
    };
    setFormState((prevState) => ({
      ...prevState,
      items: [...prevState.items, newItem],
    }));
  };

  const handleDeleteItem = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      items: prevState.items.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const item of formState.items) {
      if (!item.itemId) {
        alert("Please select an item for all rows.");
        return;
      }
      if (item.unitMRP === "" || isNaN(item.unitMRP)) {
        alert("Please provide a valid Unit MRP for all items.");
        return;
      }
    }

    const response = await updatePut(`orders/${orderId}`, formState);
    if (response !== 200) {
      console.error("Failed to update order");
      return;
    }
    navigate(`/orders`);
  };

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const pdata = await getStuff("products/options");
      setProducts(pdata);
      const cdata = await getStuff("customers/options/list");
      setCustomers(cdata);
    };

    fetchOptions();
  }, []);

  if (!orderData) return <SpinnerFullPage />;

  const invoiceReport = {
    invoiceId: 1,
    invoiceNumber: formState.invoiceNumber,
    invoiceDate: new Date(formState.invoiceDate).toISOString(),
    dueDate: new Date(formState.dueDate).toISOString(),
    orderId: Number(orderId),
    orderDate: new Date(formState.orderDate).toISOString(),
    orderStatus: formState.orderStatus,
    paymentId: 1,
    paymentDate: new Date(formState.paymentDate).toISOString(),
    paymentStatus: formState.paymentStatus,
    paymentMethod: formState.paymentMethod,
    customerId: Number(formState.customerId),
    customerName:
      customers.find((c) => c.id === Number(formState.customerId))?.name || "",
    customerAddress: formState.shippingAddress,
    shippingAddress: formState.shippingAddress,
    totalAmount: formState.items
      .reduce(
        (sum, item) =>
          sum + Number(item.salePrice) * Number(item.quantity),
        0
      )
      .toString(),
    taxAmount: formState.items
      .reduce(
        (sum, item) =>
          sum +
          (Number(item.salePrice) *
            Number(item.quantity) *
            (Number(item.cgst) + Number(item.sgst) + Number(item.cess))) /
            100,
        0
      )
      .toString(),
    discountApplied: formState.discountOnOrder.toString(),
    shippingDate: new Date(formState.shippingDate).toISOString(),
    shippingCost: formState.shippingCost.toString(),
    items: formState.items.map((item) => ({
      itemName: item.itemName,
      itemId: Number(item.itemId),
      quantity: Number(item.quantity),
      unitMRP: Number(item.unitMRP),
      discount: Number(item.discount),
      purchasePrice: Number(item.purchasePrice),
      salePrice: Number(item.salePrice),
      hsn: item.hsn || "",
      cess: item.cess || "0",
      cgst: item.cgst || "0",
      sgst: item.sgst || "0",
    })),
  };

  
return (
  <PageAnimate>
    <h2 className={styles.heading}>Edit Order #{orderId}</h2>
    <div className={styles.flexBetweenCenter}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<ReceiptIcon />}
        onClick={handleOpenInvoice}
      >
        View Invoice
      </Button>
    </div>
    <form onSubmit={handleSubmit} className={styles.spaceY6}>
      {/* Order Details */}
      <div className={styles.spaceY6}>
        <h3 className={styles.sectionTitle}>Order Details</h3>
        <div className={`${styles.gridCols1} ${styles.gridCols2Md}`}>
          <div>
            <FormControl fullWidth margin="dense">
              <InputLabel>Customer</InputLabel>
              <Select
                value={formState.customerId}
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    customerId: e.target.value,
                  }))
                }
                input={<OutlinedInput label="Customer" />}
                renderValue={(selected) => {
                  const customer = customers.find(
                    (customer) => customer.id === selected
                  );
                  return customer ? (
                    <div className={styles.flexRow}>
                      <Avatar
                        src={
                          customer.avatar
                            ? `${getBaseURL()}/${customer.avatar}`
                            : `${getBaseURL()}/default.webp`
                        }
                        alt={customer.name}
                        sx={{ width: 28, height: 28 }}
                      />
                      <span className={styles.fontRegular}>{customer.name}</span>
                      <span className={styles.fontMedium}>#{customer.id}</span>
                    </div>
                  ) : null;
                }}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    <div className={styles.flexRow}>
                      <Avatar
                        src={
                          customer.avatar
                            ? `${getBaseURL()}/${customer.avatar}`
                            : `${getBaseURL()}/default.webp`
                        }
                        alt={customer.name}
                        sx={{ width: 28, height: 28 }}
                      />
                      <span className={styles.fontRegular}>{customer.name}</span>
                      <span className={styles.fontMedium}>#{customer.id}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <label htmlFor="orderDate" className={styles.blockLabel}>
              Order Date
              <input
                id="orderDate"
                type="date"
                name="orderDate"
                value={formState.orderDate.substring(0, 10)}
                onChange={handleInputChange}
                className={styles.inputStyle}
              />
            </label>
          </div>
          <div className={`${styles.mdColSpan2}`}>
            <label htmlFor="shippingAddress" className={styles.blockLabel}>
              Shipping Address
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                value={formState.shippingAddress}
                onChange={handleInputChange}
                className={styles.textAreaStyle}
                rows={3}
              />
            </label>
          </div>
          <div>
            <label htmlFor="shippingCost" className={styles.blockLabel}>
              Shipping Cost
              <input
                id="shippingCost"
                type="number"
                name="shippingCost"
                value={formState.shippingCost}
                onChange={handleInputChange}
                className={styles.inputStyle}
                step="0.01"
              />
            </label>
          </div>
          <div>
            <label htmlFor="discountOnOrder" className={styles.blockLabel}>
              Discount on Order
              <input
                id="discountOnOrder"
                type="number"
                name="discountOnOrder"
                value={formState.discountOnOrder}
                onChange={handleInputChange}
                className={styles.inputStyle}
                step="0.01"
              />
            </label>
          </div>
          <div className={`${styles.mdColSpan2}`}>
            <label htmlFor="orderStatus" className={styles.blockLabel}>
              Order Status
              <select
                id="orderStatus"
                name="orderStatus"
                value={formState.orderStatus}
                onChange={handleInputChange}
                className={styles.inputStyle}
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <div>
            <label htmlFor="shippingDate" className={styles.blockLabel}>
              Shipping Date
              <input
                id="shippingDate"
                type="date"
                name="shippingDate"
                value={
                  formState.shippingDate
                    ? formState.shippingDate.substring(0, 10)
                    : ""
                }
                onChange={handleInputChange}
                className={styles.inputStyle}
              />
            </label>
          </div>
          <div>
            <label htmlFor="deliveryDate" className={styles.blockLabel}>
              Delivery Date
              <input
                id="deliveryDate"
                type="date"
                name="deliveryDate"
                value={
                  formState.deliveryDate
                    ? formState.deliveryDate.substring(0, 10)
                    : ""
                }
                onChange={handleInputChange}
                className={styles.inputStyle}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className={styles.spaceY6}>
        <h3 className={styles.sectionTitle}>Invoice Details</h3>
        <div className={styles.gridCols1}>
          <label htmlFor="invoiceNumber" className={styles.blockLabel}>
            Invoice Number
            <input
              id="invoiceNumber"
              type="text"
              name="invoiceNumber"
              value={formState.invoiceNumber}
              onChange={handleInputChange}
              className={styles.inputStyle}
            />
          </label>
          <label htmlFor="invoiceDate" className={styles.blockLabel}>
            Invoice Date
            <input
              id="invoiceDate"
              type="date"
              name="invoiceDate"
              value={formState.invoiceDate.substring(0, 10)}
              onChange={handleInputChange}
              className={styles.inputStyle}
            />
          </label>
          <label htmlFor="dueDate" className={styles.blockLabel}>
            Due Date
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formState.dueDate.substring(0, 10)}
              onChange={handleInputChange}
              className={styles.inputStyle}
            />
          </label>
        </div>
      </div>

      {/* Payment Details */}
      <div className={styles.spaceY6}>
        <h3 className={styles.sectionTitle}>Payment Details</h3>
        <div className={styles.gridCols1}>
          <label htmlFor="paymentStatus" className={styles.blockLabel}>
            Payment Status
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formState.paymentStatus}
              onChange={handleInputChange}
              className={styles.inputStyle}
            >
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </label>
          <label htmlFor="paymentMethod" className={styles.blockLabel}>
            Payment Method
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formState.paymentMethod}
              onChange={handleInputChange}
              className={styles.inputStyle}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label htmlFor="paymentDate" className={styles.blockLabel}>
            Payment Date
            <input
              id="paymentDate"
              type="date"
              name="paymentDate"
              value={
                formState.paymentDate
                  ? formState.paymentDate.substring(0, 10)
                  : ""
              }
              onChange={handleInputChange}
              className={styles.inputStyle}
            />
          </label>
        </div>
      </div>

      {/* ItemsEditTable Component */}
      <ItemsEditTable
        products={products}
        orderItems={formState.items}
        setOrderItems={(items) =>
          setFormState((prev) => ({ ...prev, items }))
        }
      />

      {/* Submit Button */}
      <div className={styles.flexRow} style={{ justifyContent: "flex-end" }}>
        <button type="submit" className={styles.btnSubmit}>
          Update Order
        </button>
      </div>
    </form>

    {/* Invoice Modal */}
    <Modal open={showInvoiceModal} onClose={handleCloseInvoice}>
      <Box className={styles.modalSection}>
        <ComprehensiveInvoiceTemplate
          invoiceNumber={formState.invoiceNumber}
          invoiceDate={formState.invoiceDate}
          dueDate={formState.dueDate}
          customer={customers.find(
            (customer) => customer.id === formState.customerId
          )}
          orderItems={formState.items}
          shippingCost={formState.shippingCost}
          discountOnOrder={formState.discountOnOrder}
          paymentStatus={formState.paymentStatus}
          paymentMethod={formState.paymentMethod}
        />
      </Box>
    </Modal>
  </PageAnimate>
);

};

export default InspectOrder;

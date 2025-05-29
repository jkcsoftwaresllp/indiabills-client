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
      <h2 className="text-2xl font-bold mb-4">Edit Order #{orderId}</h2>
      <div className="flex justify-between items-center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReceiptIcon />}
          onClick={handleOpenInvoice}
        >
          View Invoice
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="flex items-center">
                        <Avatar
                          src={
                            customer.avatar
                              ? `${getBaseURL()}/${customer.avatar}`
                              : `${getBaseURL()}/default.webp`
                          }
                          alt={customer.name}
                          sx={{ width: 28, height: 28 }}
                        />
                        <span
                          className="font-regular"
                          style={{ marginLeft: 8 }}
                        >
                          {customer.name}
                        </span>
                        <span className="font-medium" style={{ marginLeft: 8 }}>
                          #{customer.id}
                        </span>
                      </div>
                    ) : null;
                  }}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      <div className="flex items-center">
                        <Avatar
                          src={
                            customer.avatar
                              ? `${getBaseURL()}/${customer.avatar}`
                              : `${getBaseURL()}/default.webp`
                          }
                          alt={customer.name}
                          sx={{ width: 28, height: 28 }}
                        />
                        <span
                          className="font-regular"
                          style={{ marginLeft: 8 }}
                        >
                          {customer.name}
                        </span>
                        <span className="font-medium" style={{ marginLeft: 8 }}>
                          #{customer.id}
                        </span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Date
                <input
                  type="date"
                  name="orderDate"
                  value={formState.orderDate.substring(0, 10)}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Shipping Address
                <textarea
                  name="shippingAddress"
                  value={formState.shippingAddress}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Cost
                <input
                  type="number"
                  name="shippingCost"
                  value={formState.shippingCost}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  step="0.01"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount on Order
                <input
                  type="number"
                  name="discountOnOrder"
                  value={formState.discountOnOrder}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  step="0.01"
                />
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Order Status
                <select
                  name="orderStatus"
                  value={formState.orderStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
              <label className="block text-sm font-medium text-gray-700">
                Shipping Date
                <input
                  type="date"
                  name="shippingDate"
                  value={
                    formState.shippingDate
                      ? formState.shippingDate.substring(0, 10)
                      : ""
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Number
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formState.invoiceNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Date
                <input
                  type="date"
                  name="invoiceDate"
                  value={formState.invoiceDate.substring(0, 10)}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
                <input
                  type="date"
                  name="dueDate"
                  value={formState.dueDate.substring(0, 10)}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
                <select
                  name="paymentStatus"
                  value={formState.paymentStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
                <select
                  name="paymentMethod"
                  value={formState.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="credit">Credit</option>
                </select>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Date
                <input
                  type="date"
                  name="paymentDate"
                  value={formState.paymentDate.substring(0, 10)}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Items */}
        <ItemsEditTable
          items={formState.items}
          availableItems={products}
          handleItemChange={handleItemChange}
          handleDeleteItem={handleDeleteItem}
          handleAddItem={handleAddItem}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Update Order
          </button>
        </div>
      </form>

      {/* Invoice Preview Modal */}
      <Modal
        open={openInvoice}
        onClose={handleCloseInvoice}
        aria-labelledby="invoice-modal-title"
        aria-describedby="invoice-modal-description"
      >
        <section id="invoice">
          <ComprehensiveInvoiceTemplate
            initials={initials}
            invoice={invoiceReport}
            organization={organization}
          />
        </section>
      </Modal>
    </PageAnimate>
  );
};

export default InspectOrder;

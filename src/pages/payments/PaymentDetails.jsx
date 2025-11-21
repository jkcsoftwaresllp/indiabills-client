import { FiArrowLeft, FiX, FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageAnimate from "../../components/Animate/PageAnimate";
import Modal from "../../components/core/ModalMaker";
import { getPaymentById, updatePaymentStatus } from "../../network/api";
import "ag-grid-community/styles/ag-theme-material.css";

const PaymentDetails = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const result = await getPaymentById(paymentId);

      if (result.status === 200) {
        setPayment(result.data?.data || result.data);
        setNewStatus(
          result.data?.data?.payment_status || result.data?.payment_status
        );
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to fetch payment details",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch payment details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (newStatus === payment?.payment_status) {
      setSnackbar({
        open: true,
        message: "No changes made",
        severity: "info",
      });
      return;
    }

    setUpdating(true);
    try {
      const result = await updatePaymentStatus({
        payment_id: payment.id,
        payment_status: newStatus,
      });

      if (result.status === 200) {
        setSnackbar({
          open: true,
          message: "Payment status updated successfully",
          severity: "success",
        });
        setOpenDialog(false);
        setPayment({ ...payment, payment_status: newStatus });
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to update status",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <PageAnimate>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold">Payment not found</h1>
          <button
            onClick={() => navigate("/payments")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
          >
            Back to Payments
          </button>
        </div>
      </PageAnimate>
    );
  }

  return (
    <PageAnimate>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/payments")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Back to payments"
            >
              <FiArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Payment #{payment.id}</h1>
              <p className="text-gray-600">Order: {payment.order_number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={`py-2 px-4 rounded-full text-sm font-medium ${getStatusColor(
                payment.payment_status
              )}`}
            >
              {payment.payment_status?.charAt(0).toUpperCase() +
                payment.payment_status?.slice(1)}
            </span>
            {payment.payment_status !== "paid" && (
              <button
                onClick={() => setOpenDialog(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition flex items-center gap-2"
              >
                <FiCheck size={18} />
                Update Status
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment ID
                  </label>
                  <p className="text-lg font-semibold">{payment.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Amount
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{payment.amount?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Method
                  </label>
                  <p className="text-lg font-semibold capitalize">
                    {payment.payment_method || "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Payment Date
                  </label>
                  <p className="text-lg font-semibold">
                    {formatDate(payment.payment_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <p className="text-lg font-semibold capitalize">
                    {payment.first_name || "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <p className="text-lg font-semibold capitalize">
                    {payment.last_name || "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Customer ID
                  </label>
                  <p className="text-lg font-semibold">
                    {payment.customer_id || "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Order ID
                  </label>
                  <p className="text-lg font-semibold">
                    {payment.order_id || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            {(payment.card_number || payment.upi || payment.bank_name) && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">
                  Payment Method Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {payment.card_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Card Number
                      </label>
                      <p className="text-lg font-semibold">
                        {payment.card_number}
                      </p>
                    </div>
                  )}
                  {payment.card_holder_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Card Holder Name
                      </label>
                      <p className="text-lg font-semibold capitalize">
                        {payment.card_holder_name}
                      </p>
                    </div>
                  )}
                  {payment.card_type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Card Type
                      </label>
                      <p className="text-lg font-semibold">
                        {payment.card_type}
                      </p>
                    </div>
                  )}
                  {payment.expiry_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Expiry Date
                      </label>
                      <p className="text-lg font-semibold">
                        {formatDate(payment.expiry_date)}
                      </p>
                    </div>
                  )}
                  {payment.upi && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        UPI
                      </label>
                      <p className="text-lg font-semibold">{payment.upi}</p>
                    </div>
                  )}
                  {payment.bank_name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Bank Name
                      </label>
                      <p className="text-lg font-semibold">
                        {payment.bank_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Metadata */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${getStatusColor(
                      payment.payment_status
                    )}`}
                  >
                    {payment.payment_status?.charAt(0).toUpperCase() +
                      payment.payment_status?.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Created At
                  </label>
                  <p className="text-xs text-gray-700">
                    {formatDateTime(payment.created_at)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Updated At
                  </label>
                  <p className="text-xs text-gray-700">
                    {formatDateTime(payment.updated_at)}
                  </p>
                </div>
                {payment.created_by_user && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Created By
                    </label>
                    <p className="text-xs text-gray-700 capitalize">
                      {payment.created_by_user}
                    </p>
                  </div>
                )}
                {payment.updated_by_user && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Updated By
                    </label>
                    <p className="text-xs text-gray-700 capitalize">
                      {payment.updated_by_user}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={openDialog} onClose={() => setOpenDialog(false)}>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Update Payment Status</h2>
            <button
              onClick={() => setOpenDialog(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setOpenDialog(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusChange}
              disabled={updating}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiCheck size={18} />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Snackbar */}
      {snackbar.open && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            snackbar.severity === "success"
              ? "bg-green-500"
              : snackbar.severity === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              className="hover:bg-white hover:bg-opacity-20 rounded p-1"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}
    </PageAnimate>
  );
};

export default PaymentDetails;

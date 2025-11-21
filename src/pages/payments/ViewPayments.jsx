import { FiSearch, FiX, FiCheck, FiEye } from "react-icons/fi";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageAnimate from "../../components/Animate/PageAnimate";
import DataGrid from "../../components/FormComponent/DataGrid";
import Modal from "../../components/core/ModalMaker";
import { getPayments, updatePaymentStatus } from "../../network/api";
import { useStore } from "../../store/store";
import "ag-grid-community/styles/ag-theme-material.css";

const colDefs = (onViewPayment) => [
  {
    field: "id",
    headerName: "Payment ID",
    width: 100,
    cellRenderer: (params) => (
      <button
        onClick={() => onViewPayment(params.value)}
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-2"
        title="View payment details"
      >
        <span className="text-blue-950">#</span>
        <span>{params.value}</span>
        <FiEye size={14} />
      </button>
    ),
  },
  {
    field: "order_number",
    headerName: "Order Number",
    width: 150,
  },
  {
    field: "first_name",
    headerName: "First Name",
    width: 120,
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "last_name",
    headerName: "Last Name",
    width: 120,
    cellStyle: { textTransform: "capitalize" },
  },
  {
    field: "payment_method",
    headerName: "Method",
    width: 130,
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 120,
    cellClassRules: { money: (p) => p.value },
    valueFormatter: (params) => `₹${params.value}`,
  },
  {
    field: "payment_status",
    headerName: "Status",
    width: 130,
    cellRenderer: (params) => (
      <span
        className={`py-1 px-3 rounded-full text-xs ${
          params.value === "paid"
            ? "bg-green-100 text-green-800"
            : params.value === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : params.value === "failed"
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {params.value?.charAt(0).toUpperCase() + params.value?.slice(1)}
      </span>
    ),
  },
  {
    field: "payment_date",
    headerName: "Date",
    width: 130,
    valueFormatter: ({ value }) =>
      value ? new Date(value).toLocaleDateString() : "—",
  },
];

const ViewPayments = () => {
  const navigate = useNavigate();
  const { successPopup, errorPopup } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const handleViewPayment = (paymentId) => {
    navigate(`/payments/${paymentId}`);
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, pagination.page]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const result = await getPayments({
        status: statusFilter,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (result.status === 200) {
        // Handle the new API response format with pagination
        if (result.data?.data?.data) {
          setPayments(result.data.data.data);
          setPagination({
            page: result.data.data.page || 1,
            limit: result.data.data.limit || 20,
            total: result.data.data.total || 0,
          });
        } else if (Array.isArray(result.data)) {
          // Fallback for old format
          setPayments(result.data);
        } else {
          setPayments(result.data?.data || []);
        }
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Failed to fetch payments",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch payments",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const result = await updatePaymentStatus({
        payment_id: selectedPayment.id,
        payment_status: newStatus,
      });
      if (result.status === 200) {
        setSnackbar({
          open: true,
          message: "Payment status updated successfully",
          severity: "success",
        });
        setOpenDialog(false);
        fetchPayments();
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
    }
  };

  const filteredRowData = useMemo(
    () =>
      Array.isArray(payments)
        ? payments.filter((row) =>
            Object.values(row).some((value) => {
              if (value === null || value === undefined) return false;
              if (typeof value === "object") return false;
              return String(value)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            })
          )
        : [],
    [payments, searchTerm]
  );

  const handleQuickStatusUpdate = () => {
    if (selectedRows.length === 0) {
      alert("Please select a payment to update");
      return;
    }
    if (selectedRows.length > 1) {
      alert("Please select only one payment to update");
      return;
    }
    setSelectedPayment(selectedRows[0]);
    setNewStatus(selectedRows[0].payment_status);
    setOpenDialog(true);
  };

  const onSelectionChanged = (event) => {
    const selected = event.api.getSelectedRows();
    setSelectedRows(selected);
  };

  const onRowClicked = (rowData) => {
    setSelectedPayment(rowData);
    setNewStatus(rowData.payment_status);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-80vh flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageAnimate>
      <header className={"flex items-center justify-between px-4 py-1"}>
        <div>
          <h4 className={"text-3xl transition font-bold hover:text-rose-500"}>
            Payments
          </h4>
        </div>

        <div className="flex items-center mb-4 md:mb-0 gap-4">
          <button
            type="button"
            aria-label="search"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiSearch size={20} />
          </button>
          <input
            type="text"
            placeholder="Search payments"
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </header>

      <div
        className="ag-theme-quartz"
        style={{ height: 500, width: "100%", marginBottom: "2rem" }}
      >
        {filteredRowData.length > 0 ? (
          <DataGrid
            rowData={filteredRowData}
            colDefs={colDefs(handleViewPayment)}
            onSelectionChanged={onSelectionChanged}
            onRowClicked={onRowClicked}
          />
        ) : (
          <div className="h-full grid place-items-center">
            <div className="flex gap-4 items-center">
              <h1 className="text-2xl">
                No data found <span className="ml-4">ʕ•́ᴥ•̀ʔっ</span>
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing{" "}
          {payments.length > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0}{" "}
          to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} payments
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit) || 1}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>

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
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition flex items-center gap-2"
            >
              <FiCheck size={18} />
              Update
            </button>
          </div>
        </div>
      </Modal>

      {snackbar.open && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            snackbar.severity === "success" ? "bg-green-500" : "bg-red-500"
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

export default ViewPayments;

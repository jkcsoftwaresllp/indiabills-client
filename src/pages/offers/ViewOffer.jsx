import ViewData from "../../layouts/form/ViewData";
import { getOffers, deleteOffer, updateOffer } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const colDefs = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    cellRenderer: (params) => (
      <p>
        <span className="text-blue-950">#</span>
        <span className="font-medium">{params.value}</span>
      </p>
    ),
  },
  { field: "name", headerName: "Offer Name", filter: true, editable: true, cellStyle: { textTransform: "capitalize" } },
  { field: "description", headerName: "Description", editable: true },
  {
    field: "offer_type",
    headerName: "Offer Type",
    editable: true,
    options: [
      { value: "product_discount", label: "Product Discount" },
      { value: "order_discount", label: "Order Discount" },
      { value: "shipping_discount", label: "Free Shipping" },
    ],
  },
  {
    field: "discount_type",
    headerName: "Discount Type",
    editable: true,
    options: [
      { value: "percentage", label: "Percentage (%)" },
      { value: "fixed", label: "Fixed Amount (₹)" },
    ],
  },
  { field: "discount_value", headerName: "Discount Value", editable: true },
  { field: "max_discount_amount", headerName: "Max Discount Amount", editable: true },
  { field: "min_order_amount", headerName: "Min Order Amount", editable: true },
  {
    field: "start_date",
    headerName: "Start Date",
    editable: true,
    valueFormatter: (p) => formatDate(p.value),
  },
  {
    field: "end_date",
    headerName: "End Date",
    editable: true,
    valueFormatter: (p) => formatDate(p.value),
  },
  {
    field: "is_active",
    headerName: "Status",
    cellRenderer: (params) => (
      <span
        className={`py-1 px-3 rounded-full text-xs ${
          params.value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {params.value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    field: "created_at",
    headerName: "Created At",
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    valueFormatter: ({ value }) => formatDate(value),
  },
];

const ViewOffers = () => {
  // Transform frontend data (snake_case) to backend format
  const transformToBackendFormat = (data) => {
    return {
      name: data.name,
      description: data.description,
      offer_type: data.offer_type,
      discount_type: data.discount_type,
      discount_value: data.discount_value ? parseFloat(data.discount_value) : 0,
      max_discount_amount: data.max_discount_amount ? parseFloat(data.max_discount_amount) : 0,
      min_order_amount: data.min_order_amount ? parseFloat(data.min_order_amount) : 0,
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: Boolean(data.is_active),
    };
  };

  // Update handler for offers
  const handleUpdateOffer = async (id, data) => {
    return await updateOffer(id, data);
  };

  return (
    <ViewData
      title="Offers"
      url="/offers"
      idField="id"
      customDataFetcher={getOffers}
      initialColDefs={colDefs}
      deleteHandler={deleteOffer}
      updateHandler={handleUpdateOffer}
      transformPayload={transformToBackendFormat}
    />
  );
};

export default ViewOffers;
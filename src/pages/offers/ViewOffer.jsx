import ViewData from "../../layouts/form/ViewData";
import { getOffers, deleteOffer } from "../../network/api";
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
    checkboxSelection: true,
    headerCheckboxSelection: false,
    cellRenderer: (params) => (
      <p>
        <span className="text-blue-950">#</span>
        <span className="font-medium">{params.value}</span>
      </p>
    ),
  },
  { field: "name", headerName: "Offer Name", filter: true, editable: true, cellStyle: { textTransform: "capitalize" } },
  { field: "description", headerName: "Description", editable: true },
  { field: "offerType", headerName: "Offer Type", editable: true },
  { field: "discountType", headerName: "Discount Type", editable: true },
  { field: "discountValue", headerName: "Discount Value", editable: true },
  { field: "maxDiscountAmount", headerName: "Max Discount Amount", editable: true },
  { field: "minOrderAmount", headerName: "Min Order Amount", editable: true },
  {
    field: "startDate",
    headerName: "Start Date",
    editable: true,
    valueFormatter: (p) => formatDate(p.value),
  },
  {
    field: "endDate",
    headerName: "End Date",
    editable: true,
    valueFormatter: (p) => formatDate(p.value),
  },
  {
    field: "isActive",
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
    field: "createdAt",
    headerName: "Created At",
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    valueFormatter: ({ value }) => formatDate(value),
  },
];

const ViewOffers = () => {
  return (
    <ViewData
      title="Offers"
      url="/offers"
      customDataFetcher={async () => {
        const response = await getOffers();
        //Map backend snake_case → camelCase
        if (response?.data) {
          return response.data.map((offer) => ({
            id: offer.id,
            name: offer.name,
            description: offer.description,
            offerType: offer.offer_type,
            discountType: offer.discount_type,
            discountValue: offer.discount_value,
            maxDiscountAmount: offer.max_discount_amount,
            minOrderAmount: offer.min_order_amount,
            startDate: offer.start_date,
            endDate: offer.end_date,
            isActive: offer.is_active,
            createdAt: offer.created_at,
            updatedAt: offer.updated_at,
          }));
        }
        return [];
      }}
      initialColDefs={colDefs}
      onDelete={deleteOffer}
    />
  );
};

export default ViewOffers;
import React, { useEffect } from "react";
import ReportLayout from "./ReportLayout";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const StockLevelReport = () => {
  
  const [url, setUrl] = React.useState<string>("/reports/stocks/rate/purchase");

  const [selectedRate, setSelectedRate] = React.useState<string>("purchase");

  const columnDefs = [
    { headerName: "Item ID", field: "itemId" },
    { headerName: "Item Name", field: "itemName", filter: true },
    { headerName: "Opening Quantity", field: "openingQuantity", filter: true },
    { headerName: "Closing Quantity", field: "closingQuantity", filter: true },
    { headerName: "In Quantity", field: "inQuantity", filter: true },
    { headerName: "In Amount", field: "inAmount", filter: true },
    { headerName: "Out Quantity", field: "outQuantity", filter: true },
    { headerName: "Out Amount", field: "outAmount", filter: true },
    { headerName: "Purchase Price", field: "purchasePrice", filter: true },
    { headerName: "Sale Price", field: "salePrice", filter: true },
    { headerName: "Opening Amount", field: "openingAmount", filter: true },
    { headerName: "Closing Amount", field: "closingAmount", filter: true },
  ];

  useEffect(() => {
    setUrl(`/reports/stocks/rate/${selectedRate}`);
  },[selectedRate]);

  const totalFields = [
    "openingQuantity",
    "closingQuantity",
    "inQuantity",
    "inAmount",
    "outQuantity",
    "outAmount",
    "openingAmount",
    "closingAmount",
  ];

  return (
    <>
    <FormControl variant="outlined" size="small" style={{ minWidth: 200, marginBottom: 16 }}>
        <InputLabel id="rate-select-label">Select Rate</InputLabel>
        <Select
          labelId="rate-select-label"
          value={selectedRate}
          onChange={(event) => setSelectedRate(event.target.value as string)}
          label="Select Rate"
        >
          <MenuItem value="purchase">Purchase</MenuItem>
          <MenuItem value="sale">Sale</MenuItem>
          <MenuItem value="mrp">MRP</MenuItem>
        </Select>
      </FormControl>
    <ReportLayout
      key={url}
      title="Stock Levels Report"
      url={url}
      columnDefs={columnDefs}
      totalFields={totalFields}
    />
      </>
  );
};

export default StockLevelReport;
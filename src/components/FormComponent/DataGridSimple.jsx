import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useRef, useCallback } from "react";

const DataGridSimple = ({
  colDefs,
  rowData,
  onCellValueChanged,
  onSelectionChanged,
  onRowDoubleClicked,
}) => {
  const gridRef = useRef();

  const onSelectionChangedCallback = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (onSelectionChanged) {
        onSelectionChanged({ api: gridRef.current.api });
      }
    }
  }, [onSelectionChanged]);

  if (rowData.length === 0) {
    return (
      <div className="h-full w-full grid place-items-center">
        [no data found]
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        boxShadow: "2px 10px 16px rgba(42, 42, 42, 0.19)",
        borderRadius: "8px",
      }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        onCellValueChanged={onCellValueChanged}
        onRowDoubleClicked={onRowDoubleClicked}
        rowSelection="single"
        onSelectionChanged={onSelectionChangedCallback}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    </div>
  );
};

export default DataGridSimple;

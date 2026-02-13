import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useRef, useCallback, useMemo } from "react";

const DataGrid = ({
  colDefs,
  rowData,
  onCellValueChanged,
  onSelectionChanged,
  onRowDoubleClicked,
  onRowClicked,
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

  const onRowClickedCallback = useCallback((event) => {
    // Don't open details modal if clicking on checkbox column
    if (event.colDef && event.colDef.checkboxSelection) {
      return;
    }
    if (onRowClicked) {
      onRowClicked(event.data);
    }
  }, [onRowClicked]);

  // Add checkbox column at the beginning
  const columnDefsWithCheckbox = useMemo(() => {
    const checkboxColDef = {
      field: "checkbox",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      resizable: false,
      sortable: false,
      filter: false,
    };
    return [checkboxColDef, ...colDefs];
  }, [colDefs]);

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
        columnDefs={columnDefsWithCheckbox}
        onCellValueChanged={onCellValueChanged}
        onRowDoubleClicked={onRowDoubleClicked}
        onRowClicked={onRowClickedCallback}
        rowSelection="multiple"
        onSelectionChanged={onSelectionChangedCallback}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        suppressRowClickSelection={true}
      />
    </div>
  );
};

export default DataGrid;

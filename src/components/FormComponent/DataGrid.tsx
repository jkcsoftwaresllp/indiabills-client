// DataGrid.tsx
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../core/ContextMenu";
import { Services } from "../../definitions/Types";

interface Props<T extends Services> {
  colDefs: any[];
  rowData: any[];
  menuOptions: { label: string; onClick?: (data?: T) => void; subOptions?: { label: string; onClick: (data?: T) => void }[] }[];
  onCellValueChanged?: (event: any) => void;
  // rowSelection?: any;
  // onSelectionChanged?: (event: any) => void;
  onRowDoubleClicked?: (event: any) => void;
}

const DataGrid = <T extends Services>({
  colDefs,
  rowData,
  onCellValueChanged,
  rowSelection,
  onSelectionChanged,
  onRowDoubleClicked,
  menuOptions,
}: Props<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: { label: string; onClick?: (data?: T) => void; subOptions?: { label: string; onClick: (data?: T) => void }[] }[];
  } | null>(null);

  let touchTimeout: NodeJS.Timeout | null = null;

  const handleCellTouchStart = (params) => {
    touchTimeout = setTimeout(() => {
      const rowData = params.data;

      const touch = params.event.touches[0];

    const items = menuOptions.map((option) => ({
      label: option.label,
      onClick: () => option.onClick && option.onClick(rowData),
    }));

      const gridRect = containerRef.current?.getBoundingClientRect();
      const x = touch.clientX - gridRect.left;
      const y = touch.clientY - gridRect.top;

      setContextMenu({
        x,
        y,
        items,
      });
    }, 500); // Long-press detected after 500ms
  };

  const handleCellTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
  };

  const handleCellMouseDown = (params) => {
    if (params.event.type === "touchstart") {
      handleCellTouchStart(params);
    }
  };

  const handleCellMouseUp = (params) => {
    if (params.event.type === "touchend" || params.event.type === "touchcancel") {
      handleCellTouchEnd();
    }
  };

  const handleCellContextMenu = (params) => {
    params.event.preventDefault();

    const rowData = params.data;

    const gridRect = containerRef.current?.getBoundingClientRect();
    const x = params.event.clientX - gridRect.left;
    const y = params.event.clientY - gridRect.top;

    // Map menuOptions to include rowData in onClick
    const items = menuOptions.map((option) => ({
      label: option.label,
      onClick: () => option.onClick && option.onClick(rowData),
    }));

    setContextMenu({
      x,
      y,
      items,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".context-menu")) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  if (rowData.length === 0) {
    return (
      <div className="h-full w-full grid place-items-center">
        [no data found]
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        boxShadow: "2px 10px 16px rgba(42, 42, 42, 0.19)",
        borderRadius: "8px",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellValueChanged={onCellValueChanged}
        onRowDoubleClicked={onRowDoubleClicked}
        onCellContextMenu={handleCellContextMenu}
        onCellMouseDown={handleCellMouseDown}
        onCellMouseUp={handleCellMouseUp}
        // onSelectionChanged={onSelectionChanged}
        // rowSelection={rowSelection}
      />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

export default DataGrid;
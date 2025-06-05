import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "../core/ContextMenu";
import styles from './Styles/DataGrid.module.css';

const DataGrid = ({
  colDefs,
  rowData,
  onCellValueChanged,
  rowSelection,
  onSelectionChanged,
  onRowDoubleClicked,
  menuOptions,
}) => {
  const containerRef = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);

  let touchTimeout = null;

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
  <div ref={containerRef} className={styles.gridContainer}>
    <AgGridReact
      rowData={rowData}
      columnDefs={colDefs}
      onCellValueChanged={onCellValueChanged}
      onRowDoubleClicked={onRowDoubleClicked}
      onCellContextMenu={handleCellContextMenu}
      onCellMouseDown={handleCellMouseDown}
      onCellMouseUp={handleCellMouseUp}
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

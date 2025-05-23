import React, { useState, useRef } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  items: { label: string; onClick?: () => void; subItems?: { label: string; onClick: () => void }[] }[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  
  const handleClickOutside = (event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".context-menu")) {
      onClose();
    }
  };

  const [subMenu, setSubMenu] = useState<{ x: number; y: number; items: { label: string; onClick: () => void }[] } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent, subItems: { label: string; onClick: () => void }[]) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSubMenu({
      x: rect.right,
      y: rect.top,
      items: subItems,
    });
  };

  const handleMouseLeave = () => {
    setSubMenu(null);
  };

  return (
    <main style={{ zIndex: '99999999' }} className="" onClick={handleClickOutside}>
      <ul
        className="context-menu"
        style={{
          top: y,
          left: x,
          position: "absolute",
          listStyle: "none",
          margin: 0,
          padding: "4px 0",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          zIndex: 999999,
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="context-menu-item flex items-center border-b"
            style={{
              padding: "8px 16px",
              margin: 0,
              cursor: "pointer",
              position: "relative",
            }}
            onClick={item.onClick}
            onMouseEnter={item.subItems ? (e) => handleMouseEnter(e, item.subItems) : undefined}
          >
            {item.label}
            {item.subItems && (
              <>
                <span style={{ marginLeft: "8px" }}>▶</span>
                <ul className="context-submenu">
                  {item.subItems.map((subItem, subIndex) => (
                    <li
                      key={subIndex}
                      className="context-menu-item"
                      style={{
                        padding: "8px 16px",
                        margin: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        subItem.onClick();
                        onClose();
                      }}
                    >
                      {subItem.label}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ContextMenu;
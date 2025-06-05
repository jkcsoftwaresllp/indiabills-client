import React, { useState } from "react";
import styles from './styles/ContextMenu.module.css';

const ContextMenu = ({ x, y, items, onClose }) => {
  const handleClickOutside = (event) => {
    if (!(event.target).closest(".context-menu")) {
      onClose();
    }
  };

  const [subMenu, setSubMenu] = useState(null);

  const handleMouseEnter = (event, subItems) => {
    const rect = event.target.getBoundingClientRect();
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
  <main style={{ zIndex: '99999999' }} className={styles.contextOverlay} onClick={handleClickOutside}>
    <ul
      className={styles.contextMenu}
      style={{ top: y, left: x }}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={`${styles.contextMenuItem} ${item.subItems ? styles.hasSubmenu : ''}`}
          onClick={item.onClick}
          onMouseEnter={item.subItems ? (e) => handleMouseEnter(e, item.subItems) : undefined}
        >
          {item.label}
          {item.subItems && (
            <>
              <span className={styles.submenuArrow}>▶</span>
              <ul className={styles.contextSubmenu}>
                {item.subItems.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className={styles.contextMenuItem}
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

// CommandPalette.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import routesList from './routesList';
import styles from './styles/CommandPalette.module.css';

const CommandPalette = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(-1);
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFilteredRoutes([]);
      return;
    }

    // Filter routes based on search input
    const filtered = routesList.filter((route) =>
      route.label.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRoutes(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
  }, [search, open]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredRoutes.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredRoutes.length - 1
      );
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < filteredRoutes.length) {
        handleSelect(filteredRoutes[selectedIndex].path);
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
  <div
    className={styles.overlay}
    onClick={onClose}
    onKeyDown={handleKeyDown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="command-palette-title"
  >
    <div
      className={styles.dialog}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close Command Palette"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.closeIcon}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {/* SVG Path */}
        </svg>
      </button>

      {/* Search Input */}
      <input
        type="text"
        ref={inputRef}
        className={styles.searchInput}
        placeholder="Type a command..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Command Palette Search"
      />

      {/* List of Filtered Routes */}
      <ul
        className={styles.routeList}
        ref={listRef}
        role="listbox"
        aria-labelledby="command-palette-title"
      >
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route, index) => (
            <li
              key={route.path}
              className={`${styles.routeItem} ${index === selectedIndex ? styles.selectedItem : styles.hoverItem}`}
              onClick={() => handleSelect(route.path)}
              tabIndex={-1}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {route.label}
            </li>
          ))
        ) : (
          <li className={styles.noResult}>No results found.</li>
        )}
      </ul>
    </div>
  </div>
);
};

export default CommandPalette;

// CommandPalette.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import routesList from './routesList';

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
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      <div
        className="relative w-full max-w-md border rounded-lg shadow-lg p-4 transform transition-transform duration-300 ease-in-out glow-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-black hover:text-gray-700 focus:outline-none" aria-label="Close Command Palette" >
          {/* SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
          className="w-full bg-slate-200 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Type a command..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Command Palette Search"
        />

        {/* List of Filtered Routes */}
        <ul
          className="mt-4 max-h-60 overflow-y-auto"
          ref={listRef}
          role="listbox"
          aria-labelledby="command-palette-title"
        >
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, index) => (
              <li
                key={route.path}
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  index === selectedIndex
                    ? 'bg-primary text-light'
                    : 'hover:bg-blue-50'
                }`}
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
            <li className="px-4 py-2 text-gray-500">No results found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;

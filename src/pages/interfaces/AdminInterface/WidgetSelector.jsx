import React from 'react';

const WidgetSelector = ({
  availableWidgets,
  selectedWidgets,
  addWidget,
  removeWidget,
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Select Widgets</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        {availableWidgets.map((widget) => {
          const isSelected = selectedWidgets.find((w) => w.key === widget.key);
          return (
            <button
              key={widget.key}
              onClick={() => (isSelected ? removeWidget(widget.key) : addWidget(widget.key))}
            >
              {isSelected ? `Remove ${widget.name}` : `Add ${widget.name}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetSelector;
import { useState } from 'react';
import { FiX, FiDownload, FiCopy, FiChevronDown } from 'react-icons/fi';
import styles from './DetailsModal.module.css';

const DetailsModal = ({ open, onClose, data, columns, title }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  if (!data || !open) return null;

  const displayColumns = columns.filter(col => 
    col.field && data.hasOwnProperty(col.field)
  );

  const handleCopyAll = () => {
    const text = displayColumns
      .map(col => `${col.headerName || col.field}: ${data[col.field] || 'N/A'}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const exportAsCSV = () => {
    const csv = displayColumns
      .map(col => `"${col.headerName || col.field}","${data[col.field] || 'N/A'}"`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-details.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsJSON = () => {
    const json = displayColumns.reduce((acc, col) => {
      acc[col.headerName || col.field] = data[col.field] || 'N/A';
      return acc;
    }, {});
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-details.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      let yPos = 10;
      
      doc.setFontSize(16);
      doc.text(title, 10, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      displayColumns.forEach(col => {
        const fieldName = col.headerName || col.field;
        const fieldValue = data[col.field] || 'N/A';
        const wrappedText = doc.splitTextToSize(`${fieldName}: ${fieldValue}`, 180);
        doc.text(wrappedText, 10, yPos);
        yPos += wrappedText.length * 7;
        
        if (yPos > 270) {
          doc.addPage();
          yPos = 10;
        }
      });
      
      doc.save(`${title}-details.pdf`);
      setShowExportMenu(false);
    } catch (error) {
      console.error('PDF export error:', error);
      // Fallback: export as text file if jsPDF fails
      const text = displayColumns
        .map(col => `${col.headerName || col.field}: ${data[col.field] || 'N/A'}`)
        .join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}-details.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      setShowExportMenu(false);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${open ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>{title}</h2>
            <span className={styles.subtitle}>Complete information overview</span>
          </div>
          <div className={styles.actions}>
            <button 
              className={`${styles.btn} ${styles.copyBtn}`}
              onClick={handleCopyAll}
              title="Copy All"
            >
              <FiCopy size={16} />
              Copy All
            </button>
            <div className={styles.exportContainer}>
              <button 
                className={`${styles.btn} ${styles.exportBtn}`}
                onClick={() => setShowExportMenu(!showExportMenu)}
                title="Export options"
              >
                <FiDownload size={16} />
                Export
                <FiChevronDown size={14} />
              </button>
              {showExportMenu && (
                <div className={styles.exportMenu}>
                  <button 
                    className={styles.exportOption}
                    onClick={exportAsCSV}
                    title="Export as CSV"
                  >
                    CSV
                  </button>
                  <button 
                    className={styles.exportOption}
                    onClick={exportAsJSON}
                    title="Export as JSON"
                  >
                    JSON
                  </button>
                  <button 
                    className={styles.exportOption}
                    onClick={exportAsPDF}
                    title="Export as PDF"
                  >
                    PDF
                  </button>
                </div>
              )}
            </div>
            <button 
              className={`${styles.iconBtn} ${styles.closeBtn}`}
              onClick={onClose}
              title="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {displayColumns.length > 0 ? (
            <div className={styles.fieldsGrid}>
              {displayColumns.map((col, index) => (
                <div key={col.field} className={styles.fieldCard} style={{ '--card-delay': `${index * 0.05}s` }}>
                  <div className={styles.fieldHeader}>
                    <div className={styles.fieldDot}></div>
                    <div className={styles.fieldLabel}>
                      {col.headerName || col.field}
                    </div>
                  </div>
                  <div className={styles.fieldValue}>
                    {data[col.field] !== null && data[col.field] !== undefined 
                      ? String(data[col.field]) 
                      : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiInfo size={48} />
              </div>
              <p>No data to display</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <span className={styles.fieldCount}>{displayColumns.length} fields</span>
          </div>
          <button className={styles.primaryBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;

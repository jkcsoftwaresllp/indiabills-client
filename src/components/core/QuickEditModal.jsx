import { FiSave, FiTrash2, FiX, FiEdit3 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import styles from './QuickEditModal.module.css';

const QuickEditModal = ({ open, onClose, data, columns, onSave, onDelete, title }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
      setErrors({});
    }
  }, [data, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      onDelete(data);
    }
  };

  const editableColumns = columns.filter(col => col.editable && col.field);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.titleWithIcon}>
              <FiEdit3 className={styles.titleIcon} />
              <h2 className={styles.title}>Edit {title}</h2>
            </div>
            <p className={styles.subtitle}>Update information below</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {editableColumns.length > 0 ? (
            <div className={styles.fieldGrid}>
              {editableColumns.map((col) => (
                <div key={col.field} className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    {col.headerName}
                  </label>
                  <input
                    type={col.type || 'text'}
                    value={formData[col.field] ?? ''}
                    onChange={(e) => handleChange(col.field, e.target.value)}
                    placeholder={`Enter ${col.headerName.toLowerCase()}`}
                    className={`${styles.fieldInput} ${errors[col.field] ? styles.error : ''}`}
                  />
                  {errors[col.field] && (
                    <span className={styles.errorMsg}>{errors[col.field]}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiEdit3 />
              </div>
              <p>No editable fields available</p>
              <span>Check your field configuration</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            title="Delete this item"
          >
            <FiTrash2 />
            Delete
          </button>
          <div className={styles.footerActions}>
            <button
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
            >
              <FiSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickEditModal;

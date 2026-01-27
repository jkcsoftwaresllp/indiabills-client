import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { bulkCreateBatches, bulkCreateProducts, bulkCreateSuppliers, bulkCreateCustomers, bulkCreateCustomerAddresses, bulkCreateTransportPartners, bulkCreateInventoryMovements, bulkCreatePromotionalOffers, bulkCreateInventoryStock, bulkCreateUsers, bulkCreateWarehouses } from '../../network/api';
import { FiUpload, FiDownload, FiAlertCircle, FiCheckCircle, FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

// Professional SVG Icon Component - Unique icons for each feature
const FeatureIcon = ({ name }) => {
  const icons = {
    FiBox: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <polyline points="12 22.08 12 12"></polyline>
      </svg>
    ),
    FiList: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    ),
    FiTool: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 0-8.94-8.94l-2.83 2.83a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l2.83-2.83z"></path>
        <circle cx="11" cy="13" r="1"></circle>
      </svg>
    ),
    FiUsers: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    FiMapPin: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    FiTruck: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="22" height="12"></rect>
        <path d="M1 18h23"></path>
        <circle cx="4" cy="21" r="2"></circle>
        <circle cx="20" cy="21" r="2"></circle>
        <path d="M23 18V6"></path>
        <path d="M15 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2"></path>
      </svg>
    ),
    FiMove: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="5 9 2 12 5 15"></polyline>
        <polyline points="9 5 12 2 15 5"></polyline>
        <polyline points="15 19 12 22 9 19"></polyline>
        <polyline points="19 9 22 12 19 15"></polyline>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    FiTag: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <circle cx="8" cy="8" r="1"></circle>
      </svg>
    ),
    FiPackage: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <polyline points="12 22.08 12 12"></polyline>
      </svg>
    ),
    FiHome: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  };
  return icons[name] || icons.FiBox;
};
import {
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Typography,
} from '@mui/material';
import {
  getActiveFeatures,
  getFeatureById,
  getRequiredFields,
  getAllFields,
  getFieldsByKeys,
} from '../../config/bulkUploadConfig';
import styles from './BulkUpload.module.css';

const STEPS = ['Select Feature', 'Choose Fields', 'Upload CSV', 'Review & Submit'];

const BulkUpload = () => {
  const { successPopup, errorPopup } = useStore();

  // Wizard state
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [data, setData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const features = getActiveFeatures();
  const feature = selectedFeature ? getFeatureById(selectedFeature) : null;
  const allFields = feature ? getAllFields(selectedFeature) : [];
  const requiredFields = feature ? getRequiredFields(selectedFeature) : [];
  const fieldsToUpload = feature ? getFieldsByKeys(selectedFeature, selectedFields) : [];

  // Step 1: Feature Selection
  const handleFeatureSelect = (featureId) => {
    setSelectedFeature(featureId);
    setSelectedFields([]);
    setData([]);
    setUploadResult(null);
    setActiveStep(1);
  };

  // Step 2: Field Selection
  const handleFieldToggle = (fieldKey) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((k) => k !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSelectAllRequired = () => {
    const requiredKeys = requiredFields.map((f) => f.key);
    setSelectedFields(requiredKeys);
  };

  const handleClearFields = () => {
    setSelectedFields([]);
  };

  const handleProceedToUpload = () => {
    if (selectedFields.length === 0) {
      errorPopup('Please select at least one field');
      return;
    }
    setActiveStep(2);
  };

  // Step 3: CSV Upload
  const downloadTemplate = () => {
    const headers = fieldsToUpload.map((f) => f.label).join(',');
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(headers)}`;
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${selectedFeature}_template.csv`);
    link.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          errorPopup('CSV must contain header and at least one data row');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim());
        const dataArray = [];

        // Map headers to field keys
        const headerToKey = {};
        fieldsToUpload.forEach((field) => {
          const headerIndex = headers.findIndex(
            (h) => h === field.label
          );
          if (headerIndex !== -1) {
            headerToKey[headerIndex] = field.key;
          }
        });

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map((v) => v.trim());
          const row = {};

          Object.entries(headerToKey).forEach(([index, key]) => {
            let value = values[parseInt(index)];

            // Type conversion
            const field = fieldsToUpload.find((f) => f.key === key);
            if (field) {
              if (['number'].includes(field.type)) {
                value = value ? parseFloat(value) : null;
              } else if (field.type === 'boolean') {
                value = value?.toLowerCase() === 'true';
              }
            }

            // Handle nested fields with dot notation (e.g., taxes.cgst)
            if (key.includes('.')) {
              const [parentKey, childKey] = key.split('.');
              if (!row[parentKey]) {
                row[parentKey] = {};
              }
              row[parentKey][childKey] = value;
            } else {
              row[key] = value;
            }
          });

          if (Object.keys(row).length > 0) {
            dataArray.push(row);
          }
        }

        setData(dataArray);
        setUploadResult(null);
        successPopup(`Loaded ${dataArray.length} records from CSV`);
        setActiveStep(3);
      } catch (error) {
        errorPopup(`Error parsing CSV: ${error.message}`);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  // Step 4: Submit
  const handleSubmit = async () => {
    if (data.length === 0) {
      errorPopup('No data to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
       let response;
       
       // Call appropriate API based on feature
       if (selectedFeature === 'batches') {
         response = await bulkCreateBatches(data);
       } else if (selectedFeature === 'products') {
         response = await bulkCreateProducts(data);
       } else if (selectedFeature === 'suppliers') {
         response = await bulkCreateSuppliers(data);
       } else if (selectedFeature === 'customers') {
         response = await bulkCreateCustomers(data);
       } else if (selectedFeature === 'customerAddresses') {
         response = await bulkCreateCustomerAddresses(data);
       } else if (selectedFeature === 'transportPartners') {
         response = await bulkCreateTransportPartners(data);
       } else if (selectedFeature === 'inventoryMovements') {
         response = await bulkCreateInventoryMovements(data);
       } else if (selectedFeature === 'promotionalOffers') {
         response = await bulkCreatePromotionalOffers(data);
       } else if (selectedFeature === 'inventoryStock') {
         response = await bulkCreateInventoryStock(data);
       } else if (selectedFeature === 'users') {
         response = await bulkCreateUsers(data);
       } else if (selectedFeature === 'warehouses') {
         response = await bulkCreateWarehouses(data);
       } else {
         errorPopup(`Bulk upload for ${feature?.label} is coming soon`);
         return;
       }

       setUploadProgress(100);

       if (response.status === 201) {
         setUploadResult({
           success: true,
           message: response.message,
           count: response.count,
         });
         setData([]);
         successPopup(`${response.count} records created successfully!`);
         // Reset to step 1 after success
         setTimeout(() => {
           setActiveStep(0);
           setSelectedFeature(null);
           setSelectedFields([]);
         }, 2000);
       } else {
         setUploadResult({
           success: false,
           message: response.message,
           errors: response.errors,
         });
         setErrorDialogOpen(true);
         errorPopup(response.message);
       }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Failed to upload',
        errors: [error.message],
      });
      setErrorDialogOpen(true);
      errorPopup('Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      handleProceedToUpload();
    } else {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedFeature(null);
    setSelectedFields([]);
    setData([]);
    setUploadResult(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Box className={styles.header}>
        <h1 className={styles.headerTitle}>
          Bulk Upload
        </h1>
        <p className={styles.headerSubtitle}>
          Upload multiple records at once. Select a feature, choose fields, and upload your data.
        </p>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} className={styles.stepper}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Feature Selection */}
      {activeStep === 0 && (
        <Box>
          <h2 className={styles.sectionTitle}>
            Select a feature to upload
          </h2>
          <div className={styles.featureSelector}>
            <div className={styles.gridContainer}>
              {features.map((feat) => (
                <button
                  key={feat.id}
                  className={`${styles.featureCard} ${selectedFeature === feat.id ? styles.featureCardActive : ''}`}
                  onClick={() => handleFeatureSelect(feat.id)}
                  title={feat.label}
                >
                  <div className={styles.featureIcon}>
                    <FeatureIcon name={feat.icon} />
                  </div>
                  <h3 className={styles.featureName}>{feat.label}</h3>
                  {selectedFeature === feat.id && (
                    <div className={styles.selectBadge}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Box>
      )}

      {/* Step 2: Field Selection */}
      {activeStep === 1 && selectedFeature && (
        <Box className={styles.fieldSection}>
          <h2 className={styles.sectionTitle}>
            Select fields to upload for {feature?.label}
          </h2>

          {/* Info */}
          <Alert severity="info" className={styles.infoAlert}>
            <strong>Required fields:</strong> {requiredFields.map((f) => f.label).join(', ')}
          </Alert>

          {/* Action Buttons */}
          <Box className={styles.actionButtons}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleSelectAllRequired}
              className={styles.actionButtonsSmall}
            >
              Select All Required
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="error" 
              onClick={handleClearFields}
              className={styles.actionButtonsSmall}
            >
              Clear All
            </Button>
          </Box>

          {/* Fields Table */}
          <TableContainer component={Paper} className={styles.fieldsTable}>
            <Table>
              <TableHead className={styles.tableHeader}>
                <TableRow>
                  <TableCell align="center" width="50" className={styles.tableHeaderCell}>
                    <input type="checkbox" disabled />
                  </TableCell>
                  <TableCell className={styles.tableHeaderCell}>Field Name</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Type</TableCell>
                  <TableCell align="center" width="120" className={styles.tableHeaderCell}>
                    Required
                  </TableCell>
                  <TableCell className={styles.tableHeaderCell}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allFields.map((field) => (
                  <TableRow
                    key={field.key}
                    hover
                    className={`${styles.tableRow} ${
                      selectedFields.includes(field.key) ? styles.tableRowSelected : ''
                    }`}
                  >
                    <TableCell align="center" className={styles.tableCell}>
                      <Checkbox
                        checked={selectedFields.includes(field.key)}
                        onChange={() => handleFieldToggle(field.key)}
                        disabled={field.required}
                      />
                    </TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.tableCellBold}`}>
                      {field.label}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      <Chip label={field.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center" className={styles.tableCell}>
                      {field.required && <Chip label="Required" size="small" color="error" />}
                    </TableCell>
                    <TableCell className={styles.tableCell}>
                      {field.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary */}
          <Box className={styles.fieldsSummary}>
            <p className={styles.fieldsSummaryText}>
              Selected fields: {selectedFields.length} / {allFields.length}
            </p>
            {selectedFields.length > 0 && (
              <p className={styles.fieldsSummaryList}>
                {fieldsToUpload.map((f) => f.label).join(', ')}
              </p>
            )}
          </Box>
        </Box>
      )}

      {/* Step 3: CSV Upload */}
      {activeStep === 2 && selectedFeature && (
        <Box className={styles.uploadSection}>
          <h2 className={styles.sectionTitle}>
            Upload CSV file for {feature?.label}
          </h2>

          {/* Selected Fields Summary */}
          <Box className={styles.infoCard}>
            <p className={styles.infoCardContent}>
              CSV will contain these columns:
            </p>
            <Box className={styles.columnsList}>
              {fieldsToUpload.map((field) => (
                <span
                  key={field.key}
                  className={`${styles.columnChip} ${field.required ? '' : ''}`}
                  style={{
                    borderColor: field.required ? '#dc2626' : '#bfdbfe',
                    color: field.required ? '#dc2626' : '#1e40af',
                  }}
                >
                  {field.label}
                </span>
              ))}
            </Box>
          </Box>

          {/* Download & Upload Section */}
          <Box className={styles.uploadGrid}>
            <button
              className={styles.uploadButton}
              onClick={downloadTemplate}
            >
              <FiDownload size={18} />
              Download CSV Template
            </button>
            <label className={styles.uploadButton} style={{ cursor: 'pointer' }}>
              <FiUpload size={18} />
              Upload CSV File
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
              />
            </label>
          </Box>

          {/* Upload Progress */}
          {uploading && (
            <Box className={styles.uploadProgress}>
              <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
              <p className={styles.progressText}>
                Uploading... {uploadProgress}%
              </p>
            </Box>
          )}

          {/* Data Preview */}
          {data.length > 0 && (
            <Box className={styles.dataPreview}>
              <h3 className={styles.previewTitle}>
                Loaded Records ({data.length})
              </h3>
              <TableContainer component={Paper} style={{ maxHeight: 400, overflowY: 'auto' }}>
                <Table stickyHeader className={styles.previewTable}>
                  <TableHead className={styles.tableHeader}>
                    <TableRow>
                      <TableCell align="center" width="50" className={styles.tableHeaderCell}>
                        #
                      </TableCell>
                      {fieldsToUpload.map((field) => (
                        <TableCell key={field.key} className={styles.tableHeaderCell}>
                          {field.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} hover className={styles.tableRow}>
                        <TableCell align="center" className={styles.tableCell}>
                          {index + 1}
                        </TableCell>
                        {fieldsToUpload.map((field) => {
                          let cellValue = '-';
                          if (field.key.includes('.')) {
                            const [parentKey, childKey] = field.key.split('.');
                            cellValue = row[parentKey]?.[childKey] ?? '-';
                          } else {
                            cellValue = row[field.key] ?? '-';
                          }
                          return (
                            <TableCell key={field.key} className={styles.tableCell}>
                              {cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}

      {/* Step 4: Review & Submit */}
      {activeStep === 3 && selectedFeature && (
        <Box>
          <h2 className={styles.sectionTitle}>
            Review & Submit
          </h2>

          {/* Summary Card */}
          <Box className={styles.summaryCard}>
            <Grid container spacing={2} className={styles.summaryGrid}>
              <Grid item xs={12} sm={6}>
                <Typography className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>Feature:</span>
                  <span className={styles.summaryItemValue}>{feature?.label}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>Total Records:</span>
                  <span className={styles.summaryItemValue}>{data.length}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>Fields to Upload:</span>
                  <span className={styles.summaryItemValue}>{selectedFields.length}</span>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>Required Fields:</span>
                  <span className={styles.summaryItemValue}>{requiredFields.length}</span>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Upload Result */}
          {uploadResult && (
            <Box className={`${styles.alertBox} ${uploadResult.success ? styles.alertBoxSuccess : styles.alertBoxError}`}>
              <p className={styles.alertMessage}>
                {uploadResult.message}
              </p>
              {uploadResult.success && uploadResult.count && (
                <p className={styles.alertDetail}>
                  {uploadResult.count} records created successfully
                </p>
              )}
              <button
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
                onClick={() => setUploadResult(null)}
              >
                <FiX size={20} />
              </button>
            </Box>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Box className={styles.uploadProgress}>
              <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
              <p className={styles.progressText}>
                Uploading... {uploadProgress}%
              </p>
            </Box>
          )}
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box className={styles.navButtons}>
        <Box className={styles.navButtonsLeft}>
          <button
            className={`${styles.navButton} ${activeStep === 0 ? 'disabled' : ''}`}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            <FiChevronLeft size={18} />
            Back
          </button>
          {activeStep < STEPS.length - 1 && (
            <button
              className={`${styles.navButton} ${styles.navButtonPrimary}`}
              onClick={handleNext}
            >
              Next
              <FiChevronRight size={18} />
            </button>
          )}
        </Box>

        {activeStep === STEPS.length - 1 && (
          <Box className={styles.navButtonsRight}>
            <button
              className={styles.navButton}
              onClick={handleReset}
              disabled={uploading}
            >
              Start Over
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonPrimary}`}
              onClick={handleSubmit}
              disabled={uploading || data.length === 0}
            >
              <FiCheckCircle size={18} />
              {uploading ? 'Uploading...' : `Submit ${data.length} Records`}
            </button>
          </Box>
        )}
      </Box>

      {/* Error Details Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={styles.dialogTitle}>
          <FiAlertCircle size={20} />
          Upload Errors
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.errorsList}>
            {uploadResult?.errors?.map((error, index) => (
              <Box key={index} className={styles.errorAlert}>
                {typeof error === 'string' ? (
                  error
                ) : (
                  <>
                    <p className={styles.errorAlertTitle}>
                      Row {error.index + 1}
                    </p>
                    {error.errors?.map((err, idx) => (
                      <p key={idx} className={styles.errorAlertDetails}>
                        • {err}
                      </p>
                    ))}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BulkUpload;

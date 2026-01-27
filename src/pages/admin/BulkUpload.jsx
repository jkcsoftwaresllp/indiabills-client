import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { bulkCreateBatches, bulkCreateProducts, bulkCreateSuppliers, bulkCreateCustomers, bulkCreateCustomerAddresses, bulkCreateTransportPartners, bulkCreateInventoryMovements, bulkCreatePromotionalOffers, bulkCreateInventoryStock, bulkCreateUsers, bulkCreateWarehouses } from '../../network/api';
import { FiUpload, FiDownload, FiAlertCircle, FiCheckCircle, FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
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
            What would you like to bulk upload?
          </h2>
          <Grid container spacing={3} className={styles.featureGrid}>
            {features.map((feat) => (
              <Grid item xs={12} sm={6} md={4} key={feat.id}>
                <Card
                  className={`${styles.featureCard} ${selectedFeature === feat.id ? styles.selected : ''}`}
                  onClick={() => handleFeatureSelect(feat.id)}
                >
                  <CardActionArea>
                    <CardContent className={styles.featureCardContent}>
                      <h3 className={styles.featureCardTitle}>
                        {feat.label}
                      </h3>
                      <p className={styles.featureCardDescription}>
                        {feat.description}
                      </p>
                      <p className={styles.featureCardFooter}>
                        {getAllFields(feat.id).length} fields
                      </p>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
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

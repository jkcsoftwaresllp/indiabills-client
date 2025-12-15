import React, { useState } from "react";
import { FiColumns, FiX, FiSearch } from "react-icons/fi";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Drawer,
  IconButton,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from "./ColumnSelector.module.css";

const ColumnSelector = ({ columns, selectedColumns, onColumnChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const filteredColumns = columns.filter((col) =>
    col.headerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deselectAll = () => {
    selectedColumns.forEach((field) => {
      onColumnChange(field);
    });
  };

  const content = (
    <Box className={styles.content}>
      {/* Header Section */}
      <Box className={styles.headerSection}>
        <div className={styles.titleGroup}>
          <FiColumns className={styles.titleIcon} />
          <div>
            <Typography className={styles.title}>Select Columns</Typography>
            <Typography className={styles.subtitle}>
              Choose which columns to display ({selectedColumns.length}/
              {columns.length})
            </Typography>
          </div>
        </div>
      </Box>

      {/* Search Section */}
      <Box className={styles.searchSection}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: <FiSearch className={styles.searchIcon} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.875rem",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
              "&.Mui-focused": {
                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "#dc2032",
                },
              },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "#d1d5db",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Quick Actions */}
      <Box className={styles.quickActions}>
        <button
          className={styles.actionBtn}
          onClick={deselectAll}
          title="Clear all selections"
        >
          <FiX size={16} />
          <span>Clear</span>
        </button>
      </Box>

      {/* Columns List */}
      <Box className={styles.columnsContainer}>
        {filteredColumns.length > 0 ? (
          <FormGroup>
            {filteredColumns.map((column) => (
              <FormControlLabel
                key={column.field}
                className={styles.columnItem}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(column.field)}
                    onChange={() => onColumnChange(column.field)}
                    name={column.field}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#dc2032",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(220, 32, 50, 0.08)",
                      },
                    }}
                  />
                }
                label={
                  <span className={styles.columnLabel}>
                    {column.headerName}
                  </span>
                }
              />
            ))}
          </FormGroup>
        ) : (
          <Box className={styles.emptyState}>
            <Typography className={styles.emptyText}>
              No columns found
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer Info */}
      <Box className={styles.footerInfo}>
        <Typography className={styles.infoText}>
          {selectedColumns.length} of {columns.length} columns selected
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile || isTablet ? (
        <>
          <IconButton
            color="primary"
            aria-label="open column selector"
            onClick={toggleDrawer}
            className={styles.drawerToggle}
            title="Column selector"
          >
            <FiColumns />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                width: isMobile ? "85vw" : "400px",
                maxWidth: "100vw",
              },
            }}
          >
            {content}
          </Drawer>
        </>
      ) : (
        <Paper elevation={2} className={styles.desktopContainer}>
          {content}
        </Paper>
      )}
    </>
  );
};

export default ColumnSelector;

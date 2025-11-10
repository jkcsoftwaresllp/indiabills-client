import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Divider from '@mui/material/Divider';
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ColumnSelector = ({ columns, selectedColumns, onColumnChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const content = (
    <Box sx={{ padding: 1, maxHeight: "60vh", overflowY: "auto", backgroundColor: 'transparent', fontSize: '0.1rem' }}>
      <Typography variant="subtitle1" gutterBottom>
        <strong> Selected Columns:</strong> {selectedColumns.length}
      </Typography>
      <Divider />
      <FormGroup>
        {columns.map((column) => (
          <FormControlLabel
            key={column.field}
            control={
              <Checkbox
                checked={selectedColumns.includes(column.field)}
                onChange={() => onColumnChange(column.field)}
                name={column.field}
                color="primary"
              />
            }
            label={column.headerName}
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            color="primary"
            aria-label="open column selector"
            onClick={toggleDrawer}
            sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
          >
            <FiMenu />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Select Columns</Typography>
              <IconButton onClick={toggleDrawer}>
                <FiX />
              </IconButton>
            </Box>
            {content}
          </Drawer>
        </>
      ) : (
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            width: "100%",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {content}
        </Paper>
      )}
    </>
  );
};

export default ColumnSelector;
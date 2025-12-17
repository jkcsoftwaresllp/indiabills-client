import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import { FiFilter, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSalesSummaryReport } from '../../network/api';
import { useStore } from '../../store/store';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SalesSummaryReport = () => {
  const currentYear = new Date().getFullYear();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [filterApplied, setFilterApplied] = useState(false);
  const navigate = useNavigate();
  const { Organization } = useStore();

  const loadData = async () => {
    try {
      const response = await getSalesSummaryReport({ startDate, endDate });
      setData(response && response.length > 0 ? response[0] : null);
    } catch (error) {
      console.error('Error fetching sales summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    setLoading(true);
    setFilterApplied(true);
    loadData();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Sales Summary Report', 14, 22);

    if (data) {
      const tableData = [
        ['Metric', 'Value'],
        ['Total Orders', data.total_orders || 0],
        ['Total Revenue', `₹${(data.total_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
        ['Total Paid', `₹${(data.total_paid || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
        ['Total Unpaid', `₹${(data.total_unpaid || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
      ];

      doc.autoTable({
        startY: 30,
        head: [tableData[0]],
        body: tableData.slice(1),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        theme: 'striped',
      });
    }

    doc.save('sales_summary_report.pdf');
  };

  const formatCurrency = (value) => {
    return `₹${(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const SummaryCard = ({ label, value, color = '#0f172a' }) => (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        textAlign: 'center',
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        flexGrow: 1,
        minWidth: '200px',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          color: '#64748b',
          mb: 1,
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          fontWeight: 700,
          color: color,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        bgcolor: '#f8fafc',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            mb: 1.5,
            '& .MuiBreadcrumbs-separator': {
              mx: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <Link
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Home
          </Link>
          <Link
            color="inherit"
            onClick={() => navigate('/reports')}
            sx={{
              cursor: 'pointer',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Reports
          </Link>
          <Typography
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            Sales Summary Report
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#0f172a',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
          }}
        >
          Sales Summary Report
        </Typography>
      </Box>

      {/* Filters Section */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            alignItems: 'flex-end',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{
              width: { xs: 'calc(50% - 8px)', sm: '180px' },
              minWidth: '140px',
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
            variant="outlined"
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{
              width: { xs: 'calc(50% - 8px)', sm: '180px' },
              minWidth: '140px',
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleFilter}
            startIcon={<FiFilter size={16} />}
            sx={{
              height: '40px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            Apply Filter
          </Button>
          {filterApplied && (
            <Chip
              label="Filter Applied"
              size="small"
              variant="outlined"
              sx={{ height: '32px', fontSize: '0.65rem' }}
            />
          )}
        </Box>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                Loading report...
              </Typography>
            </Box>
          </Box>
        ) : !data ? (
          <Paper
            sx={{
              p: { xs: 3, sm: 6 },
              textAlign: 'center',
              bgcolor: '#f1f5f9',
              border: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              No data found
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: '#94a3b8',
              }}
            >
              Try adjusting your filters or selecting a different date range
            </Typography>
          </Paper>
        ) : (
          <Box>
            {/* Action Bar */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1, sm: 1.5 },
                mb: 3,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Tooltip title="Refresh data">
                <IconButton
                  size="small"
                  onClick={handleFilter}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: { xs: '6px', sm: '8px' },
                    '&:hover': { bgcolor: '#f1f5f9' },
                  }}
                >
                  <FiRefreshCw size={16} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Export as PDF">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleExportPDF}
                  startIcon={<FiDownload size={14} />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#e2e8f0',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '4px 8px', sm: '6px 12px' },
                    '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' },
                  }}
                >
                  PDF
                </Button>
              </Tooltip>
            </Box>

            {/* Summary Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                gap: { xs: 2, sm: 3 },
              }}
            >
              <SummaryCard label="Total Orders" value={data.total_orders || 0} color="#3b82f6" />
              <SummaryCard
                label="Total Revenue"
                value={formatCurrency(data.total_revenue)}
                color="#10b981"
              />
              <SummaryCard label="Total Paid" value={formatCurrency(data.total_paid)} color="#06b6d4" />
              <SummaryCard
                label="Total Unpaid"
                value={formatCurrency(data.total_unpaid)}
                color="#ef4444"
              />
            </Box>

            {/* Summary Details */}
            <Paper
              sx={{
                mt: 3,
                p: { xs: 2, sm: 3 },
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: '#64748b',
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                Summary Details
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 0.5 }}>
                    Total Orders
                  </Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {data.total_orders || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 0.5 }}>
                    Paid Amount
                  </Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {formatCurrency(data.total_paid)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 0.5 }}>
                    Unpaid Amount
                  </Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {formatCurrency(data.total_unpaid)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 0.5 }}>
                    Total Revenue
                  </Typography>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {formatCurrency(data.total_revenue)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SalesSummaryReport;
